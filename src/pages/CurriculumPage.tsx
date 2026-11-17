import { useMemo, useState } from 'react'

const curriculum: Record<string, Record<string, string[]>> = {
  Nigeria: {
    'Primary Education': ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Cultural and Creative Arts'],
    'Junior Secondary': ['English Studies', 'Mathematics', 'Basic Science and Technology', 'Business Studies', 'Civic Education'],
    'Senior Secondary': ['English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Government'],
    'Higher Education': ['Computer Science', 'Engineering', 'Business Administration', 'Education', 'Agricultural Science'],
  },
  Ghana: {
    'Primary Education': ['English Language', 'Mathematics', 'Science', 'Our World Our People'],
    'Junior Secondary': ['English Language', 'Mathematics', 'Integrated Science', 'Social Studies'],
    'Senior Secondary': ['Core Mathematics', 'English Language', 'Integrated Science', 'Social Studies'],
    'Higher Education': ['Computer Science', 'Engineering', 'Business', 'Education'],
  },
  'United Kingdom': {
    'Primary Education': ['English', 'Mathematics', 'Science', 'Computing'],
    'Junior Secondary': ['English', 'Mathematics', 'Science', 'History', 'Geography'],
    'Senior Secondary': ['English', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Computing'],
    'Higher Education': ['Computer Science', 'Engineering', 'Business', 'Education'],
  },
}

export default function CurriculumPage() {
  const [country, setCountry] = useState('Nigeria')
  const [level, setLevel] = useState('Senior Secondary')
  const [subject, setSubject] = useState('')

  const levels = Object.keys(curriculum[country])
  const subjects = useMemo(() => curriculum[country][level] ?? [], [country, level])

  function changeCountry(value: string) {
    setCountry(value)
    setLevel('Senior Secondary')
    setSubject('')
  }

  function changeLevel(value: string) {
    setLevel(value)
    setSubject('')
  }

  return (
    <div className="edu-page">
      <section className="edu-page-hero">
        <span className="edu-kicker">PERSONALISED LEARNING PATHWAYS</span>
        <h1>Curriculum &amp; <span>Exams</span></h1>
        <p>Explore subject areas by country and education level. Official curriculum documents and examination specifications will be connected after source verification.</p>
      </section>

      <section className="edu-curriculum-panel">
        <span className="edu-kicker">CURRICULUM EXPLORER</span>
        <h2>Choose your learning pathway</h2>
        <div className="edu-curriculum-selects">
          <label>Country
            <select value={country} onChange={event => changeCountry(event.target.value)}>
              {Object.keys(curriculum).map(item => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>Education level
            <select value={level} onChange={event => changeLevel(event.target.value)}>
              {levels.map(item => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <div className="edu-subject-heading"><div><h3>Subject areas</h3><p>{country} · {level}</p></div><span>{subjects.length} subjects</span></div>
        <div className="edu-subject-grid">
          {subjects.map((item, index) => (
            <button type="button" key={item} className={`edu-subject-item ${subject === item ? 'selected' : ''}`} onClick={() => setSubject(item)} aria-pressed={subject === item}>
              <span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong><span>→</span>
            </button>
          ))}
        </div>
        {subject && <div className="edu-subject-detail"><strong>{subject}</strong><p>This subject is selected. Verified syllabuses, learning objectives, resources and examination guidance will be added when authoritative curriculum sources are integrated.</p></div>}
        <p className="edu-data-note">This is an illustrative subject explorer, not an official or complete national curriculum. Confirm current requirements with the relevant education authority.</p>
      </section>
    </div>
  )
}
