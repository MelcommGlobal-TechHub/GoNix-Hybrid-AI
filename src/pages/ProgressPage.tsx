import { useState } from 'react'

const initialSkills = [
  { name: 'Web Development', level: 35, category: 'Technology' },
  { name: 'Artificial Intelligence', level: 20, category: 'Emerging technology' },
  { name: 'Problem Solving', level: 55, category: 'Core skills' },
  { name: 'Communication', level: 40, category: 'Professional skills' },
]

export default function ProgressPage() {
  const [goal, setGoal] = useState('Complete my current learning path')
  const [savedGoal, setSavedGoal] = useState('Complete my current learning path')

  return (
    <div className="edu-page stage-page">
      <section className="stage-hero">
        <span className="edu-kicker">YOUR DEVELOPMENT JOURNEY</span>
        <h1>Progress &amp; Skills</h1>
        <p>Understand your learning journey, set meaningful goals and identify skills to develop.</p>
        <span className="stage-demo-label">ILLUSTRATIVE PREVIEW · NOT ACCOUNT-VERIFIED DATA</span>
      </section>

      <div className="stage-stat-grid">
        <article className="stage-card"><span>Learning activities</span><strong>12</strong><small>Sample activity count</small></article>
        <article className="stage-card"><span>Study time</span><strong>6.5 hrs</strong><small>Sample weekly total</small></article>
        <article className="stage-card"><span>Skills in progress</span><strong>{initialSkills.length}</strong><small>Example skill categories</small></article>
        <article className="stage-card"><span>Learning streak</span><strong>3 days</strong><small>Illustrative only</small></article>
      </div>

      <section className="stage-card stage-section">
        <div className="stage-section-heading">
          <div><span className="edu-kicker">SKILL DEVELOPMENT</span><h2>Your skills map</h2></div>
          <span className="stage-pill">Sample data</span>
        </div>
        {initialSkills.map((skill) => (
          <div className="skill-progress" key={skill.name}>
            <div className="skill-progress-heading">
              <div><strong>{skill.name}</strong><small>{skill.category}</small></div>
              <span>{skill.level}%</span>
            </div>
            <div className="stage-progress-track"><span style={{ width: `${skill.level}%` }} /></div>
          </div>
        ))}
        <p className="stage-muted">Real skill levels will require completed lessons, assessments and verified learner activity.</p>
      </section>

      <section className="stage-card stage-section">
        <span className="edu-kicker">PERSONAL LEARNING GOAL</span>
        <h2>What are you working towards?</h2>
        <form className="stage-form" onSubmit={(event) => { event.preventDefault(); setSavedGoal(goal.trim() || savedGoal) }}>
          <label htmlFor="learning-goal">Your current goal</label>
          <input id="learning-goal" value={goal} onChange={(event) => setGoal(event.target.value)} maxLength={140} />
          <button className="stage-primary-button" type="submit">Save goal for this session</button>
        </form>
        <p className="stage-muted">Current goal: <strong>{savedGoal}</strong>. This preview does not sync to an account.</p>
      </section>
    </div>
  )
}
