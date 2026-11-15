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

const MODE_MAP: Record<HybridMode, InferenceMode> = {
  PREFER_ON_DEVICE: InferenceMode.PREFER_ON_DEVICE,
  PREFER_IN_CLOUD: InferenceMode.PREFER_IN_CLOUD,
  ONLY_ON_DEVICE: InferenceMode.ONLY_ON_DEVICE,
  ONLY_IN_CLOUD: InferenceMode.ONLY_IN_CLOUD,
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
      model: 'gemini-2.5-flash',
    },
  })

  await model.initializeDeviceModel(onProgress)
}

export async function runHybridInference(
  prompt: string,
  mode: HybridMode,
  cloudConsent: boolean,
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

  // Without cloud consent, local-first is enforced as local-only.
  // This prevents automatic cloud fallback when the device model is unavailable.
  const effectiveMode =
    mode === 'PREFER_ON_DEVICE' && !cloudConsent
      ? InferenceMode.ONLY_ON_DEVICE
      : MODE_MAP[mode]

  // Never attempt inference in local-only mode unless the browser supports it.
  // This also protects PREFER_ON_DEVICE when cloud consent is disabled.
  if (
    effectiveMode === InferenceMode.ONLY_ON_DEVICE &&
    !getDeviceStatus().supported
  ) {
    const status = getDeviceStatus()
    throw new Error(
      `Local inference is unavailable: ${status.explanation} Cloud fallback is disabled because permission was not granted. Your prompt was not sent to the cloud.`,
    )
  }

  const mayUseCloud = effectiveMode !== InferenceMode.ONLY_ON_DEVICE

  // This confirms client-side App Check initialization, not Firebase Console enforcement.
  if (mayUseCloud && !appCheckConfigured) {
    throw new Error(
      'Cloud inference is blocked because client-side Firebase App Check is not initialized. Configure the reCAPTCHA Enterprise site key first.',
    )
  }

  const model = getGenerativeModel(getFirebaseAI(), {
    mode: effectiveMode,
    inCloudParams: {
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    },
  })

  const result = await model.generateContent(cleanPrompt)
  const response = result.response
  const source = response.inferenceSource

  if (
    source !== InferenceSource.ON_DEVICE &&
    source !== InferenceSource.IN_CLOUD
  ) {
    throw new Error('Firebase did not report a verifiable inference source.')
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
}
