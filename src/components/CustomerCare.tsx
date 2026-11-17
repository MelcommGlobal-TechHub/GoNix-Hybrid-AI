import { useState } from 'react'
import { useAISettings } from '../context/AISettingsContext'
import { runHybridInference } from '../lib/hybrid-ai'

type Tab = 'chat' | 'voice' | 'faq' | 'feedback'
type Message = { id: number; role: 'user' | 'assistant'; text: string }

const faqs = [
  {
    q: 'What is GoNix EduPlus?',
    a: 'GoNix EduPlus is a learning platform for courses, skills development, assessments, certificates, community and AI-assisted learning.',
  },
  {
    q: 'How do I access courses?',
    a: 'Open Courses from the navigation menu to explore the course area. Course availability and enrolment will depend on the platform features enabled for your account.',
  },
  {
    q: 'How do I get a certificate?',
    a: 'Open Certificates to review your certificate area. Certificate eligibility depends on completing the required learning and assessment activities.',
  },
  {
    q: 'How does GoNix AI work?',
    a: 'GoNix uses a hybrid AI approach. It prefers supported on-device inference and can use Firebase AI Logic cloud inference only when your AI settings allow it and you have granted cloud consent.',
  },
  {
    q: 'How do I report a problem?',
    a: 'Use the Feedback tab in this support panel to prepare a report. In this prototype, feedback is not yet sent to a support team.',
  },
]

type RecognitionResult = { transcript: string }
type RecognitionEvent = { results: ArrayLike<ArrayLike<RecognitionResult>> }
type RecognitionLike = {
  lang: string
  interimResults: boolean
  onresult: ((event: RecognitionEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}
type SpeechWindow = Window & {
  SpeechRecognition?: new () => RecognitionLike
  webkitSpeechRecognition?: new () => RecognitionLike
}

export default function CustomerCare() {
  const { mode, cloudConsent } = useAISettings()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('chat')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'Hello! I’m GoNix Customer Care. I can help you navigate EduPlus, understand platform features, troubleshoot common issues and share feedback. What can I help you with?',
    },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const [feedbackType, setFeedbackType] = useState('Suggestion')
  const [feedback, setFeedback] = useState('')
  const [feedbackNotice, setFeedbackNotice] = useState('')
  const [voiceNotice, setVoiceNotice] = useState('Voice availability depends on your browser.')

  async function sendMessage(text = input) {
    const clean = text.trim()
    if (!clean || loading) return
    if (clean.length > 4000) {
      setError('Please keep your message below 4,000 characters.')
      return
    }

    setError('')
    setInput('')
    setLoading(true)
    const id = Date.now()
    const history = messages.slice(-8).map((m) =>
      `${m.role === 'user' ? 'Visitor' : 'Support assistant'}: ${m.text}`,
    ).join('\n')

    setMessages((current) => [...current, { id, role: 'user', text: clean }])

    const prompt = [
      'You are GoNix Customer Care, the official support assistant for GoNix EduPlus.',
      'Your role is platform support, user guidance, FAQs, troubleshooting, and collecting feedback.',
      'Keep answers focused on GoNix EduPlus: accounts, navigation, courses, learning, assessments, certificates, student and lecturer studios, community, messages, notifications, AI features, settings and platform access.',
      'Be warm, professional, concise and practical. Give step-by-step navigation guidance when useful.',
      'Never claim to access, change, verify or recover a user account, payment, certificate, enrolment, message or support ticket unless an authenticated tool explicitly provides that capability.',
      'Never claim that feedback has been submitted or that a human support agent has been notified. Explain when a feature is not yet connected.',
      'For account-specific, payment, security or privacy problems, direct the user to the official support channel when one is configured; do not ask for passwords, OTPs, API keys or private credentials.',
      'If a question is outside GoNix EduPlus support, politely explain your support scope and guide the user back to platform-related help.',
      history ? `Recent conversation:\n${history}` : '',
      `Visitor: ${clean}`,
      'GoNix Customer Care:',
    ].filter(Boolean).join('\n\n')

    try {
      const result = await runHybridInference(prompt, mode, cloudConsent, {
        maxOutputTokens: 1200,
      })
      setMessages((current) => [
        ...current,
        { id: id + 1, role: 'assistant', text: result.text },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Customer Care could not respond.')
    } finally {
      setLoading(false)
    }
  }

  function startVoice() {
    const speechWindow = window as SpeechWindow
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition

    if (!Recognition) {
      setVoiceNotice('Voice input is not supported by this browser. Please use the chat tab.')
      return
    }

    const recognition = new Recognition()
    recognition.lang = navigator.language || 'en'
    recognition.interimResults = false
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || ''
      if (transcript) {
        setInput(transcript)
        setVoiceNotice('Voice captured. Tap Send voice message to continue.')
      }
    }
    recognition.onerror = () => setVoiceNotice('Microphone input failed. Check browser permission and try again.')
    recognition.onend = () => {}
    setVoiceNotice('Listening… Speak now.')
    recognition.start()
  }

  function speakLastReply() {
    const reply = [...messages].reverse().find((message) => message.role === 'assistant')
    if (!reply || !('speechSynthesis' in window)) {
      setVoiceNotice('Spoken responses are not supported by this browser.')
      return
    }
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(reply.text))
    setVoiceNotice('Reading the latest support response aloud.')
  }

  function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!feedback.trim()) return
    setFeedbackNotice('Feedback captured in this session only. It has not been sent to a support team yet.')
    setFeedback('')
  }

  return (
    <div className="gonix-care-root">
      {open && (
        <section className="gonix-care-panel" aria-label="GoNix Customer Care">
          <header className="gonix-care-header">
            <div className="gonix-care-brand">
              <span className="gonix-care-avatar" aria-hidden="true">G</span>
              <span>
                <strong>GoNix Customer Care</strong>
                <small><i /> AI support assistant</small>
              </span>
            </div>
            <button type="button" className="gonix-care-close" onClick={() => setOpen(false)} aria-label="Close Customer Care">×</button>
          </header>

          <nav className="gonix-care-tabs" aria-label="Customer Care options">
            {([
              ['chat', 'Chat'],
              ['voice', 'Voice'],
              ['faq', 'FAQs'],
              ['feedback', 'Feedback'],
            ] as [Tab, string][]).map(([key, label]) => (
              <button key={key} type="button" className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{label}</button>
            ))}
          </nav>

          {tab === 'chat' && (
            <>
              <div className="gonix-care-messages" aria-live="polite">
                {messages.map((message) => (
                  <div key={message.id} className={`gonix-care-message ${message.role}`}>
                    {message.text}
                  </div>
                ))}
                {loading && <div className="gonix-care-message assistant">Preparing your answer…</div>}
              </div>
              {error && <p className="gonix-care-error" role="alert">{error}</p>}
              <form className="gonix-care-composer" onSubmit={(event) => { event.preventDefault(); void sendMessage() }}>
                <input value={input} onChange={(event) => setInput(event.target.value)} maxLength={4000} placeholder="How can we help?" aria-label="Message Customer Care" />
                <button type="submit" disabled={loading || !input.trim()}>Send</button>
              </form>
            </>
          )}

          {tab === 'voice' && (
            <div className="gonix-care-tab-content">
              <div className="gonix-care-voice-icon" aria-hidden="true">🎙</div>
              <h3>Talk to GoNix Customer Care</h3>
              <p>Use your microphone to dictate a support question. You can also listen to the latest assistant response.</p>
              <button type="button" onClick={startVoice}>Start microphone</button>
              <button type="button" className="secondary" onClick={speakLastReply}>Speak latest response</button>
              <p className="gonix-care-note" aria-live="polite">{voiceNotice}</p>
              <form className="gonix-care-composer" onSubmit={(event) => { event.preventDefault(); void sendMessage() }}>
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Recognised speech appears here" aria-label="Recognised voice message" />
                <button type="submit" disabled={loading || !input.trim()}>Send</button>
              </form>
            </div>
          )}

          {tab === 'faq' && (
            <div className="gonix-care-tab-content">
              <h3>Frequently asked questions</h3>
              {faqs.map((faq, index) => (
                <div className="gonix-care-faq" key={faq.q}>
                  <button type="button" aria-expanded={faqOpen === index} onClick={() => setFaqOpen(faqOpen === index ? null : index)}>
                    {faq.q}<span>{faqOpen === index ? '−' : '+'}</span>
                  </button>
                  {faqOpen === index && <p>{faq.a}</p>}
                </div>
              ))}
            </div>
          )}

          {tab === 'feedback' && (
            <div className="gonix-care-tab-content">
              <h3>Share your feedback</h3>
              <p>Tell us what is working well or what should improve.</p>
              <form className="gonix-care-feedback" onSubmit={submitFeedback}>
                <label htmlFor="care-feedback-type">Feedback type</label>
                <select id="care-feedback-type" value={feedbackType} onChange={(event) => setFeedbackType(event.target.value)}>
                  <option>Suggestion</option>
                  <option>Complaint</option>
                  <option>Bug report</option>
                  <option>Compliment</option>
                </select>
                <label htmlFor="care-feedback-message">Your message</label>
                <textarea id="care-feedback-message" value={feedback} onChange={(event) => setFeedback(event.target.value)} required maxLength={2000} rows={5} placeholder="Describe your feedback…" />
                <button type="submit">Save feedback draft</button>
              </form>
              {feedbackNotice && <p className="gonix-care-note" role="status">{feedbackNotice}</p>}
            </div>
          )}
          <footer className="gonix-care-footer">GoNix EduPlus · Support experience preview</footer>
        </section>
      )}

      <button
        type="button"
        className={`gonix-care-launcher ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close GoNix Customer Care' : 'Open GoNix Customer Care'}
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {open
            ? <path d="m6 6 12 12M18 6 6 18" />
            : <><path d="M4 13v-2a8 8 0 0 1 16 0v2" /><path d="M4 13h3v6H6a2 2 0 0 1-2-2v-4Zm16 0h-3v6h1a2 2 0 0 0 2-2v-4Z" /><path d="M17 19a5 5 0 0 1-5 2" /></>}
        </svg>
        <span>{open ? 'Close' : 'Customer Care'}</span>
      </button>
    </div>
  )
}
