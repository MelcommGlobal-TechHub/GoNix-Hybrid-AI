
import {
  getGenerativeModel,
  InferenceMode,
  InferenceSource,
  type InferenceSource as InferenceSourceType,
} from 'firebase/ai'
import { appCheckConfigured, getFirebaseAI } from './firebase'

export type HybridMode =
  | 'PREFER_ON_DEVICE'
  | 'PREFER_IN_CLOUD'
  | 'ONLY_ON_DEVICE'
  | 'ONLY_IN_CLOUD'

export interface InferenceResult {
  text: string
  source: InferenceSourceType
  mode: HybridMode
  effectiveMode: InferenceMode
}

export interface DeviceStatus {
  apiDetected: boolean
  secureContext: boolean
  supported: boolean
  explanation: string
}

export interface StreamCallbacks {
  onText?: (text: string) => void
  maxOutputTokens?: number
}

const MODE_MAP: Record<HybridMode, InferenceMode> = {
  PREFER_ON_DEVICE: InferenceMode.PREFER_ON_DEVICE,
  PREFER_IN_CLOUD: InferenceMode.PREFER_IN_CLOUD,
  ONLY_ON_DEVICE: InferenceMode.ONLY_ON_DEVICE,
  ONLY_IN_CLOUD: InferenceMode.ONLY_IN_CLOUD,
}

const MODEL_NAME = 'gemini-3.5-flash-lite'
const DEFAULT_OUTPUT_TOKENS = 1024
const MAX_RETRIES = 2

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)

  return /\b(500|502|503|504|429)\b|unavailable|overloaded|deadline exceeded|timed out|timeout/i.test(
    message,
  )
}

export function getDeviceStatus(): DeviceStatus {
  if (typeof window === 'undefined') {
    return {
      apiDetected: false,
      secureContext: false,
      supported: false,
      explanation: 'A browser environment is required for on-device inference.',
    }
  }

  const apiDetected = 'LanguageModel' in window
  const secureContext = window.isSecureContext

  return {
    apiDetected,
    secureContext,
    supported: apiDetected && secureContext,
    explanation: !secureContext
      ? 'A secure HTTPS browser context is required.'
      : !apiDetected
        ? 'This browser does not expose the on-device LanguageModel API.'
        : 'The browser exposes the on-device LanguageModel API. Actual model availability must still be verified.',
  }
}

export async function prepareDeviceModel(
  onProgress?: (progress: number) => void,
): Promise<void> {
  const status = getDeviceStatus()

  if (!status.supported) {
    throw new Error(status.explanation)
  }

  const model = getGenerativeModel(getFirebaseAI(), {
    mode: InferenceMode.ONLY_ON_DEVICE,
    inCloudParams: {
      model: MODEL_NAME,
    },
  })

  await model.initializeDeviceModel(onProgress)
}

export async function runHybridInference(
  prompt: string,
  mode: HybridMode,
  cloudConsent: boolean,
  callbacks: StreamCallbacks = {},
): Promise<InferenceResult> {
  const cleanPrompt = prompt.trim()

  if (!cleanPrompt) {
    throw new Error('Enter a prompt before running inference.')
  }

  if (cleanPrompt.length > 12000) {
    throw new Error('Your prompt is too long. Keep it under 12,000 characters.')
  }

  if (
    (mode === 'PREFER_IN_CLOUD' || mode === 'ONLY_IN_CLOUD') &&
    !cloudConsent
  ) {
    throw new Error(
      'Cloud permission is required for this inference mode. Enable cloud permission or select a local-first mode.',
    )
  }

  const effectiveMode =
    mode === 'PREFER_ON_DEVICE' && !cloudConsent
      ? InferenceMode.ONLY_ON_DEVICE
      : MODE_MAP[mode]

  if (effectiveMode === InferenceMode.ONLY_ON_DEVICE) {
    const status = getDeviceStatus()

    if (!status.supported) {
      throw new Error(
        `Local inference is unavailable: ${status.explanation} Cloud fallback is disabled because permission was not granted. Your prompt was not sent to the cloud.`,
      )
    }
  }

  const mayUseCloud = effectiveMode !== InferenceMode.ONLY_ON_DEVICE

  if (mayUseCloud && !appCheckConfigured) {
    throw new Error(
      'Cloud inference is blocked because client-side Firebase App Check is not initialized.',
    )
  }

  const maxOutputTokens = Math.min(
    4096,
    Math.max(128, callbacks.maxOutputTokens ?? DEFAULT_OUTPUT_TOKENS),
  )

  const model = getGenerativeModel(getFirebaseAI(), {
    mode: effectiveMode,
    inCloudParams: {
      model: MODEL_NAME,
      generationConfig: {
        maxOutputTokens,
      },
    },
  })

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    let receivedText = ''

    try {
      const result = await model.generateContentStream(cleanPrompt)

      for await (const chunk of result.stream) {
        const chunkText = chunk.text()

        if (chunkText) {
          receivedText += chunkText
          callbacks.onText?.(receivedText)
        }
      }

      const response = await result.response
      const source = response.inferenceSource

      if (
        source !== InferenceSource.ON_DEVICE &&
        source !== InferenceSource.IN_CLOUD
      ) {
        throw new Error(
          'Firebase did not report a verifiable inference source.',
        )
      }

      if (source === InferenceSource.IN_CLOUD && !cloudConsent) {
        throw new Error(
          'Cloud inference was reported without permission. The response was not accepted.',
        )
      }

      if (
        effectiveMode === InferenceMode.ONLY_ON_DEVICE &&
        source !== InferenceSource.ON_DEVICE
      ) {
        throw new Error(
          'Local-only mode did not return a verified on-device response.',
        )
      }

      const text = response.text()

      if (!text.trim()) {
        throw new Error('The model returned an empty response.')
      }

      return {
        text,
        source,
        mode,
        effectiveMode,
      }
    } catch (error) {
      // Never retry after exposing partial text: that could duplicate output.
      if (receivedText.length > 0) {
        throw error
      }

      if (attempt >= MAX_RETRIES || !isRetryableError(error)) {
        throw error
      }

      // Exponential backoff with jitter: approximately 1–1.5s,
      // then 2–2.5s. The total number of attempts is capped at three.
      await wait(1000 * 2 ** attempt + Math.random() * 500)
    }
  }

  throw new Error('Inference failed after the permitted retry attempts.')
}
