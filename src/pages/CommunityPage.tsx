import { useState } from 'react'

type Post = { id: number; author: string; time: string; text: string; likes: number }

const starterPosts: Post[] = [
  { id: 1, author: 'GoNix Learning Community', time: 'Community example', text: 'Welcome to the GoNix EduPlus community. Share what you are learning, ask thoughtful questions and support other learners.', likes: 8 },
  { id: 2, author: 'Technology Learners', time: 'Community example', text: 'What technology skill are you most excited to develop this month? Let us learn from one another.', likes: 5 },
]

export default function CommunityPage() {
  const [posts, setPosts] = useState(starterPosts)
  const [draft, setDraft] = useState('')
  const [liked, setLiked] = useState<number[]>([])

  function publish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.trim()) return
    setPosts((current) => [{ id: Date.now(), author: 'You · Local preview', time: 'Just now', text: draft.trim(), likes: 0 }, ...current])
    setDraft('')
  }

  function toggleLike(id: number) {
    const alreadyLiked = liked.includes(id)
    setLiked((current) => alreadyLiked ? current.filter((item) => item !== id) : [...current, id])
    setPosts((current) => current.map((post) => post.id === id ? { ...post, likes: Math.max(0, post.likes + (alreadyLiked ? -1 : 1)) } : post))
  }

  return (
    <div className="edu-page stage-page">
      <section className="stage-hero">
        <span className="edu-kicker">LEARN TOGETHER</span>
        <h1>GoNix Community</h1>
        <p>Exchange ideas, discuss learning experiences and encourage other learners.</p>
        <span className="stage-demo-label">LOCAL INTERACTION PREVIEW · NOT PUBLISHED TO OTHER USERS</span>
      </section>

      <div className="stage-two-column">
        <section className="stage-card stage-section">
          <h2>Share with the community</h2>
          <form className="stage-form" onSubmit={publish}>
            <label htmlFor="community-post">Your post</label>
            <textarea id="community-post" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="What are you learning or thinking about?" rows={4} maxLength={1200} />
            <div className="stage-form-footer"><small>{draft.length}/1200</small><button className="stage-primary-button" type="submit" disabled={!draft.trim()}>Create post</button></div>
          </form>
        </section>
        <aside className="stage-card stage-section">
          <span className="edu-kicker">COMMUNITY GUIDELINES</span>
          <h2>Make learning welcoming</h2>
          <ul className="stage-list">
            <li>Respect different perspectives.</li>
            <li>Share constructive feedback.</li>
            <li>Do not publish passwords or private information.</li>
            <li>Report harmful or misleading content when moderation is available.</li>
          </ul>
        </aside>
      </div>

      <section className="stage-section">
        <div className="stage-section-heading"><div><span className="edu-kicker">DISCUSSIONS</span><h2>Community feed</h2></div><span className="stage-pill">{posts.length} preview posts</span></div>
        <div className="stage-feed">
          {posts.map((post) => (
            <article className="stage-card stage-post" key={post.id}>
              <div className="stage-post-author"><span className="stage-avatar">{post.author.charAt(0)}</span><div><strong>{post.author}</strong><small>{post.time}</small></div></div>
              <p>{post.text}</p>
              <button type="button" className={`stage-secondary-button ${liked.includes(post.id) ? 'is-selected' : ''}`} onClick={() => toggleLike(post.id)}>♡ {post.likes} · {liked.includes(post.id) ? 'Liked' : 'Like'}</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
