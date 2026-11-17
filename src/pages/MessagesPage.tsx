import { useState } from 'react'

type Conversation = { id: number; name: string; preview: string; messages: string[]; request?: boolean }

const initialConversations: Conversation[] = [
  { id: 1, name: 'Learning Support (Demo)', preview: 'Welcome to the message preview.', messages: ['Welcome to the GoNix EduPlus messaging preview.'] },
  { id: 2, name: 'Project Collaboration (Demo)', preview: 'Let us discuss project ideas.', messages: ['This is a sample conversation. Real users cannot see these messages.'], request: true },
]

export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations)
  const [selected, setSelected] = useState(1)
  const [draft, setDraft] = useState('')
  const active = conversations.find((item) => item.id === selected)
  const requests = conversations.filter((item) => item.request).length

  function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.trim() || !active) return
    const message = draft.trim()
    setConversations((current) => current.map((item) => item.id === selected ? { ...item, messages: [...item.messages, message], preview: message } : item))
    setDraft('')
  }

  function acceptRequest(id: number) {
    setConversations((current) => current.map((item) => item.id === id ? { ...item, request: false } : item))
    setSelected(id)
  }

  return (
    <div className="edu-page stage-page">
      <section className="stage-hero">
        <span className="edu-kicker">STAY CONNECTED</span>
        <h1>Messages</h1>
        <p>Communicate with fellow learners and manage incoming message requests.</p>
        <span className="stage-demo-label">LOCAL DEMONSTRATION · NO REAL USERS OR SERVER MESSAGES</span>
      </section>
      <section className="stage-messaging">
        <aside className="stage-card stage-inbox">
          <div className="stage-section-heading"><h2>Inbox</h2><span className="stage-pill">{requests} requests</span></div>
          {conversations.map((item) => (
            <button type="button" key={item.id} className={`stage-conversation ${selected === item.id ? 'active' : ''}`} onClick={() => setSelected(item.id)}>
              <span className="stage-avatar">{item.name.charAt(0)}</span>
              <span className="stage-conversation-copy"><strong>{item.name}</strong><small>{item.preview}</small>{item.request && <em>Message request</em>}</span>
            </button>
          ))}
        </aside>
        <div className="stage-card stage-chat">
          {active ? <>
            <div className="stage-chat-heading"><span className="stage-avatar">{active.name.charAt(0)}</span><div><strong>{active.name}</strong><small>Demo conversation</small></div></div>
            {active.request && <div className="stage-request-banner"><p>This is a sample message request. In the live service, you can accept or decline requests before opening a conversation.</p><button type="button" className="stage-primary-button" onClick={() => acceptRequest(active.id)}>Accept request</button></div>}
            <div className="stage-chat-messages">
              {active.messages.map((message, index) => <div className="stage-chat-bubble" key={`${active.id}-${index}`}>{message}</div>)}
            </div>
            <form className="stage-chat-composer" onSubmit={send}>
              <label className="sr-only" htmlFor="message-draft">Write a message</label>
              <input id="message-draft" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." maxLength={2000} />
              <button className="stage-primary-button" type="submit" disabled={!draft.trim()}>Send</button>
            </form>
          </> : <p>Select a conversation.</p>}
        </div>
      </section>
      <section className="stage-card stage-section">
        <span className="edu-kicker">MESSAGING PRIVACY</span>
        <h2>Connection and message-request policy</h2>
        <p className="stage-muted">The planned policy supports both direct messaging and connection-based privacy controls. Message requests, blocking, reporting, rate limits and server-side access rules must be implemented before real user conversations are enabled.</p>
      </section>
    </div>
  )
}
