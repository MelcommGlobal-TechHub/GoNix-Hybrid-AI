import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import {
  getDeviceStatus,
  prepareDeviceModel,
  type HybridMode,
} from '../lib/hybrid-ai'
import { useAISettings, themeOptions } from '../context/AISettingsContext'
import type { VisualType } from '../lib/outputs/types'

const modes: { id: HybridMode; name: string; description: string }[] = [
  {
    id: 'PREFER_ON_DEVICE',
    name: 'On-device first',
    description: 'Use local AI first. Cloud fallback is blocked unless you explicitly allow it.',
  },
  {
    id: 'PREFER_IN_CLOUD',
    name: 'Cloud first',
    description: 'Prefer Firebase cloud AI. Cloud use still requires your permission.',
  },
  {
    id: 'ONLY_ON_DEVICE',
    name: 'Local only',
    description: 'Never send your prompt to cloud AI.',
  },
  {
    id: 'ONLY_IN_CLOUD',
    name: 'Cloud only',
    description: 'Use Firebase cloud AI only, with your explicit permission.',
  },
]

const visualTypes: { id: VisualType; label: string }[] = [
  { id: 'infographic', label: 'Infographic' },
  { id: 'diagram', label: 'Diagram' },
  { id: 'flowchart', label: 'Flowchart' },
  { id: 'mindmap', label: 'Mind map' },
  { id: 'chart', label: 'Chart' },
  { id: 'graph', label: 'Graph' },
]

export default function SettingsPage() {
  const {
    mode, setMode, cloudConsent, setCloudConsent,
    outputMode, setOutputMode, visualType, setVisualType,
    theme, setTheme, resetSettings,
  } = useAISettings()

  const device = useMemo(() => getDeviceStatus(), [])
  const [preparing, setPreparing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')

  async function handlePrepare() {
    setPreparing(true)
    setMessage('')
    setProgress(0)
    try {
      await prepareDeviceModel((value) => setProgress(value))
      setMessage('The device model preparation request completed.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Model preparation failed.')
    } finally {
      setPreparing(false)
    }
  }

  return (
    <main className="edu-page edu-settings-page">
      <header className="edu-settings-heading">
        <span className="edu-kicker">GONIX EDUPLUS PREFERENCES</span>
        <h1>Settings</h1>
        <p>
          Manage your appearance, AI processing and output preferences.
          You can return here at any time to review or change your preferences.
        </p>
      </header>

      <div className="edu-settings-navigation">
        <Link className="edu-settings-back" to="/hybrid-ai">
          ← Back to AI Workspace
        </Link>
      </div>

      <section className="edu-settings-section">
        <h2>AI processing preferences</h2>
        <p className="edu-muted">
          Choose where AI processing should happen. Selecting a cloud mode does
          not itself grant cloud permission.
        </p>
        <div className="edu-settings-options">
          {modes.map((item) => (
            <label className={`edu-settings-option ${mode === item.id ? 'selected' : ''}`} key={item.id}>
              <input
                type="radio"
                name="ai-mode"
                checked={mode === item.id}
                onChange={() => setMode(item.id)}
              />
              <span>
                <strong>{item.name}</strong>
                <small>{item.description}</small>
              </span>
            </label>
          ))}
        </div>

        <label className="edu-settings-toggle">
          <input
            type="checkbox"
            checked={cloudConsent}
            onChange={(event) => setCloudConsent(event.target.checked)}
          />
          <span>
            <strong>Allow cloud AI processing</strong>
            <small>
              When enabled, prompts and relevant request content may be sent to
              Firebase cloud AI when your selected strategy requires it.
              Turn this off to withdraw permission.
            </small>
          </span>
        </label>
        <p className="edu-settings-note">
          Cloud permission is {cloudConsent ? 'enabled' : 'off'}.
          It is never enabled automatically by choosing a cloud strategy.
        </p>
      </section>

      <section className="edu-settings-section">
        <h2>Output preferences</h2>
        <label className="edu-settings-field">
          <span>Default AI result</span>
          <select value={outputMode} onChange={(event) =>
            setOutputMode(event.target.value as 'text' | 'visual')}>
            <option value="text">Text response</option>
            <option value="visual">Visual result</option>
          </select>
        </label>

        <label className="edu-settings-field">
          <span>Preferred visual type</span>
          <select value={visualType} onChange={(event) =>
            setVisualType(event.target.value as VisualType)}>
            {visualTypes.map((item) => (
              <option value={item.id} key={item.id}>{item.label}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="edu-settings-section">
        <h2>Appearance</h2>
        <label className="edu-settings-field">
          <span>Colour theme</span>
          <select value={theme} onChange={(event) =>
            setTheme(event.target.value as typeof theme)}>
            {themeOptions.map((item) => (
              <option value={item.id} key={item.id}>{item.label}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="edu-settings-section">
        <h2>On-device AI readiness</h2>
        <div className="edu-settings-status">
          <p><strong>Language model API:</strong> {device.apiDetected ? 'Detected' : 'Not detected'}</p>
          <p><strong>Secure context:</strong> {device.secureContext ? 'Available' : 'Unavailable'}</p>
          <p><strong>Device support:</strong> {device.supported ? 'Potentially supported' : 'Not currently supported'}</p>
          <p className="edu-muted">{device.explanation}</p>
        </div>
        <button
          type="button"
          className="edu-settings-action"
          onClick={handlePrepare}
          disabled={preparing || !device.supported}
        >
          {preparing ? `Preparing ${progress}%` : 'Prepare on-device model'}
        </button>
        {message && <p className="edu-settings-note" role="status">{message}</p>}
      </section>

      <section className="edu-settings-section">
        <h2>Reset preferences</h2>
        <p className="edu-muted">
          Restore the default theme, on-device-first strategy, text output and
          disabled cloud permission.
        </p>
        <button
          type="button"
          className="edu-settings-reset"
          onClick={() => {
            if (window.confirm('Reset all GoNix EduPlus preferences to their defaults?')) {
              resetSettings()
              setMessage('Preferences restored to defaults.')
            }
          }}
        >
          Reset preferences
        </button>
      </section>
    </main>
  )
}
