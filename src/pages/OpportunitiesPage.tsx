import { useMemo, useState } from 'react'

const opportunities = [
  { id: 1, title: 'Technology Skills Development', type: 'Learning', mode: 'Online', description: 'Explore structured technology learning and practical skill-building activities.', status: 'Example listing' },
  { id: 2, title: 'Student Innovation Project', type: 'Project', mode: 'Hybrid', description: 'Develop a project idea, document your progress and build a portfolio.', status: 'Example listing' },
  { id: 3, title: 'Early-Career Technology Pathway', type: 'Career', mode: 'Varies', description: 'Explore career preparation, practical experience and professional development.', status: 'Example listing' },
  { id: 4, title: 'Scholarship Discovery Guide', type: 'Scholarship', mode: 'Online', description: 'Learn how to research eligibility, prepare applications and track deadlines.', status: 'Example listing' },
]

export default function OpportunitiesPage() {
  const [filter, setFilter] = useState('All')
  const [saved, setSaved] = useState<number[]>([])
  const types = ['All', 'Learning', 'Project', 'Career', 'Scholarship']
  const filtered = useMemo(() => filter === 'All' ? opportunities : opportunities.filter((item) => item.type === filter), [filter])

  return (
    <div className="edu-page stage-page">
      <section className="stage-hero">
        <span className="edu-kicker">YOUR NEXT STEP</span>
        <h1>Opportunities</h1>
        <p>Explore learning pathways, projects, career preparation and scholarship discovery.</p>
        <span className="stage-demo-label">SAMPLE CATALOGUE · NO LIVE VACANCIES OR DEADLINES VERIFIED</span>
      </section>
      <div className="stage-filter-row" aria-label="Filter opportunities">
        {types.map((type) => <button key={type} type="button" onClick={() => setFilter(type)} className={`stage-filter ${filter === type ? 'active' : ''}`}>{type}</button>)}
      </div>
      <div className="stage-opportunity-grid">
        {filtered.map((item) => (
          <article className="stage-card stage-opportunity" key={item.id}>
            <span className="stage-pill">{item.type}</span>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div className="stage-opportunity-meta"><span>{item.mode}</span><span>{item.status}</span></div>
            <button type="button" className={`stage-secondary-button ${saved.includes(item.id) ? 'is-selected' : ''}`} onClick={() => setSaved((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])}>{saved.includes(item.id) ? 'Saved in this session' : 'Save opportunity'}</button>
          </article>
        ))}
      </div>
      <p className="stage-muted">Before applying to any real opportunity, verify the organisation, eligibility criteria, application URL and deadline through its official source. Never pay an unverified recruiter.</p>
    </div>
  )
}
