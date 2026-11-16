import { useMemo, useRef, useState } from 'react'
import {
  getDeviceStatus,
  prepareDeviceModel,
  runHybridInference,
  type HybridMode,
} from './lib/hybrid-ai'
import { firebaseConfigured, appCheckConfigured } from './lib/firebase'
import { generateVisualResult } from './lib/outputs/visual-generator'
import { downloadTextResult, downloadVisualResult } from './lib/outputs/downloads'
import VisualRenderer from './lib/outputs/VisualRenderer'
import type { OutputMode, VisualResult, VisualType } from './lib/outputs/types'
import './App.css'

const modes: {
  id: HybridMode
  name: string
  description: string
}[] = [
  {
    id: 'PREFER_ON_DEVICE',
    name: 'On-device first',
    description: 'Use local AI first. Cloud fallback requires permission.',
  },
  {
    id: 'PREFER_IN_CLOUD',
    name: 'Cloud first',
    description: 'Prefer Firebase cloud AI, with local fallback.',
  },
  {
    id: 'ONLY_ON_DEVICE',
    name: 'Local only',
    description: 'Never send your prompt to cloud AI.',
  },
  {
    id: 'ONLY_IN_CLOUD',
    name: 'Cloud only',
    description: 'Use Firebase cloud AI exclusively.',
  },
]

function App() {
  const [mode, setMode] = useState<HybridMode>('PREFER_ON_DEVICE')
  const [cloudConsent, setCloudConsent] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [outputMode, setOutputMode] = useState<OutputMode>('text')
  const [visualType, setVisualType] = useState<VisualType>('flowchart')
  const [visualResult, setVisualResult] = useState<VisualResult | null>(null)
  const [downloading, setDownloading] = useState(false)
  const visualRef = useRef<HTMLDivElement>(null)
  const [source, setSource] = useState<'on_device' | 'in_cloud' | null>(null)
  const [loading, setLoading] = useState(false)
  const [preparing, setPreparing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const device = useMemo(() => getDeviceStatus(), [])
  const selectedMode = modes.find((item) => item.id === mode)!

  async function handlePrepareDevice() {
    setPreparing(true)
    setError('')
    setProgress(0)

    try {
      await prepareDeviceModel((value) => {
        setProgress(Math.round(value * 100))
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Device preparation failed.')
    } finally {
      setPreparing(false)
    }
  }

  async function handleGenerate() {
    setLoading(true)
    setError('')
    setResponse('')
    setVisualResult(null)
    setSource(null)

    try {
      if (outputMode === 'visual') {
        const result = await generateVisualResult(
          prompt,
          visualType,
          mode,
          cloudConsent,
        )
        setVisualResult(result)
        setSource(result.inferenceSource)
      } else {
        const result = await runHybridInference(prompt, mode, cloudConsent, {
          onText: (streamedText) => setResponse(streamedText),
          maxOutputTokens: 1024,
        })
        setResponse(result.text)
        setSource(result.source)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inference request failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleTextDownload(format: 'pdf' | 'docx' | 'txt') {
    if (!response.trim()) return

    setDownloading(true)
    setError('')

    try {
      await downloadTextResult('GoNix Hybrid AI Response', response, format)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Text download failed.')
    } finally {
      setDownloading(false)
    }
  }

  async function handleVisualDownload(format: 'png' | 'svg' | 'pdf') {
    if (!visualRef.current || !visualResult) return

    setDownloading(true)
    setError('')

    try {
      await downloadVisualResult(
        visualRef.current,
        visualResult.title,
        format,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Visual download failed.')
    } finally {
      setDownloading(false)
    }
  }

  const sourceLabel = source === 'on_device'
    ? 'ON_DEVICE'
    : source === 'in_cloud'
      ? 'IN_CLOUD'
      : 'NOT RUNNING'

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="GoNix Hybrid AI home">
          <span className="brand-mark">G</span>
          <span>GoNix <strong>Hybrid AI</strong></span>
          <span className="version-tag">AI SERVICES PLATFORM</span>
        </a>

        <nav className="top-nav">
          <a href="#playground">Playground</a>
          <a href="#architecture">Architecture</a>
          <a href="#runtime">Runtime</a>
          <a
            href="https://github.com/MelcommGlobal-TechHub/GoNix-Hybrid-AI"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="eyebrow">
            <span className="live-dot" />
            INTELLIGENCE WITHOUT BOUNDARIES
          </div>

          <h1>
            AI that runs <span>where you are.</span>
          </h1>

          <p className="hero-description">
            A hybrid inference experience that prioritizes on-device
            intelligence and uses Firebase AI Logic cloud inference when
            permitted and necessary.
          </p>

          <div className="hero-meta">
            <span><i /> On-device capable architecture</span>
            <span><i /> Firebase AI Logic</span>
            <span><i /> Privacy-aware fallback</span>
          </div>
        </section>

        <section className="status-grid" id="runtime">
          <article className="status-card">
            <div className="status-heading">APPLICATION</div>
            <div className="status-value">
              <span className={firebaseConfigured ? 'status-indicator good' : 'status-indicator'} />
              {firebaseConfigured ? 'Configured' : 'Awaiting setup'}
            </div>
            <p>Firebase project configuration</p>
          </article>

          <article className="status-card">
            <div className="status-heading">ON-DEVICE API</div>
            <div className="status-value">
              <span className={device.supported ? 'status-indicator good' : 'status-indicator'} />
              {device.supported ? 'Detected' : 'Not detected'}
            </div>
            <p>Browser LanguageModel capability</p>
          </article>

          <article className="status-card">
            <div className="status-heading">APP CHECK</div>
            <div className="status-value">
              <span className={appCheckConfigured ? 'status-indicator good' : 'status-indicator'} />
              {appCheckConfigured ? 'Initialized' : 'Not initialized'}
            </div>
            <p>Client-side App Check initialization</p>
          </article>

          <article className="status-card">
            <div className="status-heading">LAST INFERENCE</div>
            <div className="status-value source-value">{sourceLabel}</div>
            <p>Verified response source</p>
          </article>
        </section>

        <section className="workspace" id="playground">
          <div className="workspace-main">
            <div className="section-heading">
              <div>
                <div className="eyebrow">HYBRID AI WORKSPACE</div>
                <h2>AI Playground</h2>
                <p>Test hybrid inference with your selected privacy settings.</p>
              </div>
              <span className="preview-tag">AI PLAYGROUND</span>
            </div>

            <div className="panel mode-panel">
              <div className="panel-heading">
                <div>
                  <h3>Inference strategy</h3>
                  <p>Choose how your request should be processed.</p>
                </div>
                <span className="subtle-label">01 / MODE</span>
              </div>

              <div className="mode-grid">
                {modes.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`mode-option ${mode === item.id ? 'selected' : ''}`}
                    onClick={() => {
                      setMode(item.id)
                      setError('')
                    }}
                    aria-pressed={mode === item.id}
                  >
                    <span className="mode-radio" />
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </button>
                ))}
              </div>

              <div className="selected-mode">
                <span>SELECTED STRATEGY</span>
                <strong>{selectedMode.name}</strong>
              </div>
            </div>

            <div className="panel prompt-panel">
              <div className="panel-heading">
                <div>
                  <h3>Prompt input</h3>
                  <p>Your prompt is processed according to the selected strategy.</p>
                </div>
                <span className="subtle-label">02 / INPUT</span>
              </div>

              <div className="output-mode-selector">
                <span className="input-label">OUTPUT FORMAT</span>
                <div className="output-mode-grid">
                  <button
                    type="button"
                    className={`output-mode-option ${outputMode === 'text' ? 'selected' : ''}`}
                    onClick={() => {
                      setOutputMode('text')
                      setError('')
                      setVisualResult(null)
                    }}
                    aria-pressed={outputMode === 'text'}
                  >
                    <strong>Text Results</strong>
                    <small>Answers, explanations and documents</small>
                  </button>
                  <button
                    type="button"
                    className={`output-mode-option ${outputMode === 'visual' ? 'selected' : ''}`}
                    onClick={() => {
                      setOutputMode('visual')
                      setError('')
                      setResponse('')
                    }}
                    aria-pressed={outputMode === 'visual'}
                  >
                    <strong>Visual Results</strong>
                    <small>Diagrams, charts and infographics</small>
                  </button>
                </div>
              </div>

              {outputMode === 'visual' && (
                <div className="visual-type-selector">
                  <label className="input-label" htmlFor="visual-type">
                    VISUAL TYPE
                  </label>
                  <select
                    id="visual-type"
                    value={visualType}
                    onChange={(event) => setVisualType(event.target.value as VisualType)}
                  >
                    <option value="infographic">Infographic</option>
                    <option value="diagram">Diagram</option>
                    <option value="flowchart">Flowchart</option>
                    <option value="mindmap">Mind map</option>
                    <option value="chart">Chart</option>
                    <option value="graph">Graph</option>
                  </select>
                  <p className="micro-copy">
                    AI-generated image illustrations are not enabled on the current Firebase plan.
                    Structured visual generation remains available.
                  </p>
                </div>
              )}

              <label className="input-label" htmlFor="prompt">
                MESSAGE
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Ask GoNix Hybrid AI anything..."
                maxLength={12000}
                rows={7}
              />

              <div className="input-footer">
                <span>{prompt.length.toLocaleString()} / 12,000 characters</span>
                <span>Do not enter passwords or sensitive personal information.</span>
              </div>

              <div className="consent-box">
                <div className="consent-copy">
                  <strong>Allow cloud inference</strong>
                  <p>
                    Permit this request to use Firebase cloud AI when the
                    selected strategy requires or allows it.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={cloudConsent}
                  className={`toggle ${cloudConsent ? 'enabled' : ''}`}
                  onClick={() => setCloudConsent((value) => !value)}
                  aria-label="Allow cloud inference"
                >
                  <span />
                </button>
              </div>

              <div className="privacy-note">
                <span className="privacy-icon">◇</span>
                {cloudConsent
                  ? 'Cloud processing is permitted for this session. The actual response source will be displayed.'
                  : 'Cloud permission is off. On-device-first requests are enforced as local-only. No cloud fallback.'}
              </div>

              <button
                type="button"
                className="run-button"
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
              >
                {loading ? 'Processing request...' : 'Run inference'}
                {!loading && <span>→</span>}
              </button>
            </div>

            {(response || visualResult || error || loading) && (
              <div className="panel response-panel">
                <div className="panel-heading">
                  <div>
                    <h3>{outputMode === 'visual' ? 'Visual result' : 'Text result'}</h3>
                    <p>Generated output and actual execution source.</p>
                  </div>
                  {source && (
                    <span className={`source-badge ${source === 'on_device' ? 'local' : 'cloud'}`}>
                      {source === 'on_device' ? 'ON DEVICE' : 'IN CLOUD'}
                    </span>
                  )}
                </div>

                {loading && (
                  <div className="loading-line">
                    {outputMode === 'visual' ? 'Generating visual result...' : 'Generating response...'}
                  </div>
                )}

                {error && <div className="error-message">{error}</div>}

                {response && (
                  <>
                    <div className="response-text">{response}</div>
                    <div className="download-actions">
                      <span className="micro-copy">DOWNLOAD TEXT</span>
                      <button type="button" className="download-button" onClick={() => handleTextDownload('pdf')} disabled={downloading}>PDF</button>
                      <button type="button" className="download-button" onClick={() => handleTextDownload('docx')} disabled={downloading}>DOCX</button>
                      <button type="button" className="download-button" onClick={() => handleTextDownload('txt')} disabled={downloading}>TXT</button>
                    </div>
                  </>
                )}

                {visualResult && (
                  <>
                    <div className="visual-export-surface" ref={visualRef}>
                      <VisualRenderer visual={visualResult} />
                    </div>
                    <div className="download-actions">
                      <span className="micro-copy">DOWNLOAD VISUAL</span>
                      <button type="button" className="download-button" onClick={() => handleVisualDownload('png')} disabled={downloading}>PNG</button>
                      <button type="button" className="download-button" onClick={() => handleVisualDownload('svg')} disabled={downloading}>SVG</button>
                      <button type="button" className="download-button" onClick={() => handleVisualDownload('pdf')} disabled={downloading}>PDF</button>
                    </div>
                  </>
                )}

                {downloading && <div className="micro-copy">Preparing download...</div>}
              </div>
            )}
          </div>

          <aside className="workspace-side">
            <div className="panel device-panel">
              <div className="panel-heading">
                <div>
                  <h3>Device compatibility</h3>
                  <p>Local inference readiness</p>
                </div>
                <span className="subtle-label">03</span>
              </div>

              <div className="device-check">
                <span>LanguageModel API</span>
                <strong>{device.apiDetected ? 'Detected' : 'Unavailable'}</strong>
              </div>
              <div className="device-check">
                <span>Secure context</span>
                <strong>{device.secureContext ? 'Yes' : 'No'}</strong>
              </div>
              <div className="device-check">
                <span>Local inference</span>
                <strong>{device.supported ? 'Potentially supported' : 'Not ready'}</strong>
              </div>

              <p className="device-explanation">{device.explanation}</p>

              <button
                type="button"
                className="secondary-button"
                onClick={handlePrepareDevice}
                disabled={preparing || !device.supported}
              >
                {preparing ? `Preparing ${progress}%` : 'Prepare on-device model'}
              </button>
              <p className="micro-copy">
                Model preparation may download model files. Start only when
                you are ready and have sufficient storage and network access.
              </p>
            </div>

            <div className="panel architecture-panel" id="architecture">
              <div className="panel-heading">
                <div>
                  <h3>Inference architecture</h3>
                  <p>How a request is routed</p>
                </div>
              </div>

              <div className="architecture-flow">
                <div className="flow-node active-node">
                  <span>01</span>
                  <div><strong>User prompt</strong><small>Privacy settings</small></div>
                </div>
                <div className="flow-line" />
                <div className="flow-node">
                  <span>02</span>
                  <div><strong>Inference router</strong><small>Selected strategy</small></div>
                </div>
                <div className="flow-line" />
                <div className="flow-node">
                  <span>03A</span>
                  <div><strong>On-device AI</strong><small>Browser model</small></div>
                </div>
                <div className="flow-or">OR</div>
                <div className="flow-node">
                  <span>03B</span>
                  <div><strong>Firebase AI Logic</strong><small>Cloud model</small></div>
                </div>
                <div className="flow-line" />
                <div className="flow-node result-node">
                  <span>04</span>
                  <div><strong>Verified result</strong><small>Source reported</small></div>
                </div>
              </div>
            </div>

            <div className="panel security-panel">
              <div className="security-icon">⌑</div>
              <h3>Privacy by design</h3>
              <p>
                Local-only mode blocks cloud fallback. Cloud-enabled modes
                require consent and client-side App Check initialization.
              </p>
              <span className="security-footnote">
                App Check enforcement must also be configured in Firebase Console.
              </span>
            </div>
          </aside>
        </section>

        <section className="capabilities-section">
          <div className="eyebrow">BUILT FOR THE GO NIX ECOSYSTEM</div>
          <h2>One intelligence layer. Multiple experiences.</h2>
          <div className="capability-grid">
            <article className="capability-card">
              <span>01</span><h3>Learning assistant</h3>
              <p>Help learners understand concepts and explore new skills.</p>
            </article>
            <article className="capability-card">
              <span>02</span><h3>Lesson summaries</h3>
              <p>Turn learning materials into concise, useful explanations.</p>
            </article>
            <article className="capability-card">
              <span>03</span><h3>Practice coach</h3>
              <p>Support practice, revision and guided problem solving.</p>
            </article>
            <article className="capability-card">
              <span>04</span><h3>Smart study tools</h3>
              <p>Build lesson-grounded quizzes and personalized study support.</p>
            </article>
          </div>
        </section>

        <section className="integration-note">
          <div>
            <div className="eyebrow">GO NIX 3.0 INTEGRATION</div>
            <h2>Empowering creativity, innovation and learning.</h2>
            <p>
              GoNix Hybrid AI enhances the GoNix ecosystem with intelligent
              experiences that help creators explore ideas, innovators build
              solutions and learners develop practical skills. It complements
              GoNix 3.0 while existing platform services continue to manage
              authentication, learning records, assessments, certificates
              and GoCredit.
            </p>
          </div>
          <span className="integration-mark">G</span>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#">
          <span className="brand-mark">G</span>
          <span>GoNix <strong>Hybrid AI</strong></span>
        </a>
        <span>Enhancing creativity, innovation and learning across the GoNix ecosystem.</span>
        <span>Powered by B12 TechHub · GoNix Ecosystem</span>
      </footer>
    </div>
  )
}

export default App
