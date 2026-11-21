import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { HybridMode } from '../lib/hybrid-ai'
import type { OutputMode, VisualType } from '../lib/outputs/types'

export type ThemeId = 'original' | 'ice' | 'midnight' | 'aurora' | 'warm' | 'system'

export interface AISettings {
  mode: HybridMode
  cloudConsent: boolean
  outputMode: OutputMode
  visualType: VisualType
  theme: ThemeId
}

interface AISettingsContextValue extends AISettings {
  setMode: (value: HybridMode) => void
  setCloudConsent: (value: boolean) => void
  setOutputMode: (value: OutputMode) => void
  setVisualType: (value: VisualType) => void
  setTheme: (value: ThemeId) => void
  resetSettings: () => void
}

const STORAGE_KEY = 'gonix-eduplus-ai-settings'
const THEME_KEY = 'gonix-eduplus-theme'

export const themeOptions: { id: ThemeId; label: string }[] = [
  { id: 'original', label: 'GoNix Original' },
  { id: 'ice', label: 'Ice Light' },
  { id: 'midnight', label: 'Midnight' },
  { id: 'aurora', label: 'Aurora' },
  { id: 'warm', label: 'Warm' },
  { id: 'system', label: 'System' },
]

const defaults: AISettings = {
  mode: 'PREFER_ON_DEVICE',
  cloudConsent: false,
  outputMode: 'text',
  visualType: 'flowchart',
  theme: 'original',
}

function readSettings(): AISettings {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const savedTheme = localStorage.getItem(THEME_KEY)
    const validThemes = themeOptions.map((item) => item.id)
    const modes: HybridMode[] = [
      'PREFER_ON_DEVICE', 'PREFER_IN_CLOUD', 'ONLY_ON_DEVICE', 'ONLY_IN_CLOUD',
    ]
    const visualTypes: VisualType[] = [
      'infographic', 'diagram', 'flowchart',
      'mindmap', 'chart', 'graph',
    ]

    return {
      mode: modes.includes(saved.mode) ? saved.mode : defaults.mode,
      cloudConsent: saved.cloudConsent === true,
      outputMode: saved.outputMode === 'visual' ? 'visual' : 'text',
      visualType: visualTypes.includes(saved.visualType)
        ? saved.visualType : defaults.visualType,
      theme: validThemes.includes(savedTheme as ThemeId)
        ? savedTheme as ThemeId
        : validThemes.includes(saved.theme) ? saved.theme : defaults.theme,
    }
  } catch {
    return defaults
  }
}

const AISettingsContext = createContext<AISettingsContextValue | null>(null)

export function AISettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AISettings>(readSettings)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      localStorage.setItem(THEME_KEY, settings.theme)
    } catch {
      // Preferences remain active for this session if storage is unavailable.
    }

    document.documentElement.dataset.theme = settings.theme

    const colors: Record<ThemeId, string> = {
      original: '#09090b',
      ice: '#f3f8ff',
      midnight: '#071426',
      aurora: '#111027',
      warm: '#f7f1e7',
      system: window.matchMedia('(prefers-color-scheme: light)').matches
        ? '#f3f8ff' : '#09090b',
    }
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', colors[settings.theme])
  }, [settings])

  useEffect(() => {
    if (settings.theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const update = () => {
      document.querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', media.matches ? '#f3f8ff' : '#09090b')
    }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [settings.theme])

  const value = useMemo<AISettingsContextValue>(() => ({
    ...settings,
    setMode: (mode) => setSettings((old) => ({ ...old, mode })),
    setCloudConsent: (cloudConsent) =>
      setSettings((old) => ({ ...old, cloudConsent })),
    setOutputMode: (outputMode) =>
      setSettings((old) => ({ ...old, outputMode })),
    setVisualType: (visualType) =>
      setSettings((old) => ({ ...old, visualType })),
    setTheme: (theme) => setSettings((old) => ({ ...old, theme })),
    resetSettings: () => setSettings(defaults),
  }), [settings])

  return (
    <AISettingsContext.Provider value={value}>
      {children}
    </AISettingsContext.Provider>
  )
}

export function useAISettings() {
  const value = useContext(AISettingsContext)
  if (!value) {
    throw new Error('useAISettings must be used inside AISettingsProvider')
  }
  return value
}
