import { useState } from 'react'

type Notice = { id: number; title: string; body: string; time: string; read: boolean }

const initialNotices: Notice[] = [
  { id: 1, title: 'Welcome to GoNix EduPlus', body: 'Your learning workspace is ready to explore.', time: 'Sample notification', read: false },
  { id: 2, title: 'Explore GoNix AI Agent', body: 'Ask questions and practise new skills with the hybrid AI experience.', time: 'Sample notification', read: false },
  { id: 3, title: 'Set a learning goal', body: 'Visit Progress & Skills to define a goal for your learning journey.', time: 'Sample notification', read: true },
]

export default function NotificationsPage() {
  const [items, setItems] = useState(initialNotices)
  const unread = items.filter((item) => !item.read).length

  function markAllRead() {
    setItems((current) => current.map((item) => ({ ...item, read: true })))
  }

  return (
    <div className="edu-page stage-page">
      <section className="stage-hero">
        <span className="edu-kicker">YOUR PLATFORM UPDATES</span>
        <h1>Notifications</h1>
        <p>Review learning reminders and updates from your GoNix EduPlus workspace.</p>
        <span className="stage-demo-label">LOCAL PREVIEW · PUSH DELIVERY NOT CONFIGURED</span>
      </section>
      <section className="stage-card stage-section">
        <div className="stage-section-heading">
          <div><span className="edu-kicker">NOTIFICATION CENTRE</span><h2>{unread} unread</h2></div>
          <button type="button" className="stage-secondary-button" onClick={markAllRead} disabled={unread === 0}>Mark all as read</button>
        </div>
        <div className="stage-notice-list">
          {items.map((item) => (
            <article className={`stage-notice ${item.read ? '' : 'unread'}`} key={item.id}>
              <span className="stage-notice-dot" aria-hidden="true" />
              <div className="stage-notice-content"><strong>{item.title}</strong><p>{item.body}</p><small>{item.time}</small></div>
              {!item.read && <button type="button" className="stage-text-button" onClick={() => setItems((current) => current.map((notice) => notice.id === item.id ? { ...notice, read: true } : notice))}>Mark read</button>}
            </article>
          ))}
        </div>
      </section>
      <section className="stage-card stage-section">
        <span className="edu-kicker">PUSH NOTIFICATIONS</span>
        <h2>Device notification setup</h2>
        <p className="stage-muted">Push notifications are not active yet. They require Firebase Cloud Messaging configuration, a service worker, browser permission and trusted server-side delivery. This page does not request notification permission until that integration is ready.</p>
      </section>
    </div>
  )
}
