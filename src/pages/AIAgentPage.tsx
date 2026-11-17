import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAISettings } from '../context/AISettingsContext'
import { runHybridInference } from '../lib/hybrid-ai'
import '../App.css'

type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  content: string
  source?: string
}

const suggestions = [
  'Explain artificial intelligence in simple terms.',
  'Create a practical seven-day study plan for me.',
  'Help me understand JavaScript functions with examples.',
  'Give me five practice questions about cybersecurity.',
]

export default function AIAgentPage() {
  const { mode, cloudConsent } = useAISettings()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nextId, setNextId] = useState(1)

  const sourceLabel = (source?: string) => {
    if (source === 'ON_DEVICE') return 'ON-DEVICE'
    if (source === 'IN_CLOUD') return 'FIREBASE AI LOGIC'
    return 'PENDING'
  }

  async function sendMessage(value = input) {
    const clean = value.trim()
    if (!clean || loading) return

    if (clean.length > 8000) {
      setError('Please keep each message below 8,000 characters.')
      return
    }

    setError('')
    setInput('')
    setLoading(true)

    const userId = nextId
    const assistantId = nextId + 1
    setNextId((id) => id + 2)

    const userMessage: ChatMessage = {
      id: userId,
      role: 'user',
      content: clean,
    }

    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
    }

    const previousMessages = messages.slice(-8)
    const conversationContext = previousMessages
      .map((message) => `${message.role === 'user' ? 'Visitor' : 'GoNix Support'}: ${message.content}`)
      .join('\n\n')

    const fullPrompt = [
      'You are GoNix Customer Care, the official platform support assistant for GoNix EduPlus.',
      'Your purpose is to help visitors understand and use GoNix EduPlus, navigate platform features, troubleshoot common issues, answer FAQs and provide feedback guidance.',
      'Be warm, professional, accurate and practical. Give clear step-by-step platform guidance when useful.',
      'Keep answers focused on GoNix EduPlus accounts, courses, learning, assessments, certificates, Student Studio, Lecturer Studio, community, messages, notifications, AI features and settings. Never claim to access or change accounts, payments, enrolments, certificates, messages or support tickets unless an authorized integration actually provides that capability. Never claim feedback has been submitted or a human agent notified when no such integration exists. Never ask for passwords, OTPs, API keys or private credentials. Politely redirect unrelated questions to GoNix EduPlus support.',
      conversationContext ? `Recent conversation:\n${conversationContext}` : '',
      `Learner: ${clean}`,
      'GoNix Customer Care:',
    ].filter(Boolean).join('\n\n')

    setMessages((current) => [...current, userMessage, assistantMessage])

    try {
      const result = await runHybridInference(
        fullPrompt,
        mode,
        cloudConsent,
        {
          maxOutputTokens: 2048,
          onText: (streamedText) => {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId
                  ? { ...message, content: streamedText }
                  : message,
              ),
            )
          },
        },
      )

      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content: result.text,
                source: String(result.source),
              }
            : message,
        ),
      )
    } catch (err) {
      setMessages((current) =>
        current.filter((message) => message.id !== assistantId),
      )
      setError(
        err instanceof Error
          ? err.message
          : 'The AI Agent could not complete this request.',
      )
    } finally {
      setLoading(false)
    }
  }

  function clearConversation() {
    if (loading) return
    setMessages([])
    setError('')
    setNextId(1)
  }

  return (
    <div className="app-shell">
      <main className="main-content ai-agent-page">
        <section className="ai-agent-hero">
          <div className="eyebrow">
            <span className="live-dot" />
            OFFICIAL GONIX EDUPLUS SUPPORT
          </div>

          <h1>
            Meet <span>GoNix Customer Care.</span>
          </h1>

          <p className="hero-description">
            Get help with your GoNix EduPlus account, courses, assessments, certificates, platform features and technical questions.
          </p>

          <div className="hero-meta">
            <span><i /> On-device when supported</span>
            <span><i /> Firebase AI Logic</span>
            <span><i /> Consent-controlled cloud access</span>
          </div>
        </section>

        <section className="ai-agent-workspace">
          <div className="ai-agent-toolbar">
            <div className="ai-agent-identity">
              <div className="ai-agent-avatar" aria-hidden="true">✦</div>
              <div>
                <strong>GoNix Customer Care</strong>
                <span>Platform Support · FAQs · Feedback</span>
              </div>
            </div>

            <button
              className="ai-agent-clear"
              type="button"
              onClick={clearConversation}
              disabled={loading || messages.length === 0}
            >
              Clear chat
            </button>
          </div>

          <div className="ai-agent-privacy">
            <span aria-hidden="true">◈</span>
            <p>
              <strong>Privacy mode:</strong> Your existing AI settings control
              inference. Cloud processing is subject to your explicit consent.
              <Link to="/settings"> Review AI settings</Link>.
            </p>
          </div>

          <div className="ai-agent-messages" aria-live="polite">
            {messages.length === 0 ? (
              <div className="ai-agent-welcome">
                <div className="ai-agent-welcome-mark">✦</div>
                <h2>How can we help you today?</h2>
                <p>
                  Ask about GoNix EduPlus, get platform guidance or report a problem.
                </p>

                <div className="ai-agent-suggestions">
                  {suggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      disabled={loading}
                    >
                      <span>✧</span>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <article
                  className={`ai-agent-message ${message.role}`}
                  key={message.id}
                >
                  <div className="ai-agent-message-avatar">
                    {message.role === 'user' ? 'You' : '✦'}
                  </div>

                  <div className="ai-agent-message-body">
                    <div className="ai-agent-message-heading">
                      <strong>
                        {message.role === 'user' ? 'You' : 'GoNix Support'}
                      </strong>
                      {message.role === 'assistant' && message.source && (
                        <span className="ai-agent-source">
                          {sourceLabel(message.source)}
                        </span>
                      )}
                    </div>

                    <div className="ai-agent-message-text">
                      {message.content || (loading ? 'Thinking…' : '')}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {error && (
            <div className="ai-agent-error" role="alert">
              <strong>Request could not be completed</strong>
              <p>{error}</p>
            </div>
          )}

          <form
            className="ai-agent-composer"
            onSubmit={(event) => {
              event.preventDefault()
              void sendMessage()
            }}
          >
            <label className="sr-only" htmlFor="ai-agent-input">
              Message GoNix Customer Care
            </label>

            <textarea
              id="ai-agent-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Describe your GoNix EduPlus question or support issue..."
              rows={2}
              maxLength={8000}
              disabled={loading}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  void sendMessage()
                }
              }}
            />

            <div className="ai-agent-composer-bottom">
              <span>Enter to send · Shift + Enter for a new line</span>
              <button type="submit" disabled={loading || !input.trim()}>
                {loading ? 'Working…' : 'Send message ↑'}
              </button>
            </div>
          </form>

          <p className="ai-agent-disclaimer">
            AI responses can contain mistakes. Verify important information.
            This chat is currently stored only in this page session.
          </p>
        </section>
      </main>
    </div>
  )
}
