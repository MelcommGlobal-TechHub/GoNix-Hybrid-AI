import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const courses = [
  { title: 'Introduction to Artificial Intelligence', category: 'Artificial Intelligence', level: 'Beginner', duration: '4 weeks', description: 'Explore AI concepts, applications and responsible use.', icon: '✦' },
  { title: 'Web Development Fundamentals', category: 'Technology', level: 'Beginner', duration: '6 weeks', description: 'Learn the foundations of modern web development.', icon: '⌘' },
  { title: 'Python Programming', category: 'Technology', level: 'Intermediate', duration: '8 weeks', description: 'Build programming skills through practical exercises.', icon: '⌁' },
  { title: 'Digital Skills and Productivity', category: 'Digital Skills', level: 'Beginner', duration: '3 weeks', description: 'Develop useful digital and workplace skills.', icon: '▤' },
  { title: 'Entrepreneurship and Innovation', category: 'Business', level: 'Beginner', duration: '5 weeks', description: 'Explore ideas, business models and innovation.', icon: '↗' },
  { title: 'Data Analysis Fundamentals', category: 'Technology', level: 'Intermediate', duration: '7 weeks', description: 'Understand data, analysis and practical insights.', icon: '▥' },
]

const categories = ['All', 'Artificial Intelligence', 'Technology', 'Digital Skills', 'Business']

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => courses.filter(course => {
    const matchesCategory = category === 'All' || course.category === category
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || `${course.title} ${course.description} ${course.category}`.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  }), [search, category])

  return (
    <div className="edu-page">
      <section className="edu-page-hero">
        <span className="edu-kicker">DISCOVER KNOWLEDGE</span>
        <h1>Explore <span>Courses</span></h1>
        <p>Discover learning experiences designed to build knowledge and practical skills.</p>
      </section>

      <section className="edu-catalogue-tools">
        <label className="edu-search-label">
          <span>Search courses</span>
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by course, skill or subject..." />
        </label>
        <div className="edu-filter-list" aria-label="Course categories">
          {categories.map(item => (
            <button type="button" key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>
          ))}
        </div>
      </section>

      <div className="edu-catalogue-heading">
        <div><span className="edu-kicker">LEARNING CATALOGUE</span><h2>{filtered.length} courses</h2></div>
        <span className="edu-demo-label">SAMPLE CATALOGUE</span>
      </div>

      <div className="edu-course-grid">
        {filtered.map(course => (
          <article className="edu-course-card" key={course.title}>
            <div className="edu-course-icon">{course.icon}</div>
            <span className="edu-course-category">{course.category}</span>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <div className="edu-course-meta"><span>{course.level}</span><span>{course.duration}</span></div>
            <Link to="/learning" className="edu-card-link">View learning space →</Link>
          </article>
        ))}
      </div>
      {filtered.length === 0 && <p className="edu-empty-state">No courses match your search. Try another keyword or category.</p>}
      <p className="edu-data-note">Catalogue content is demonstration data, not a live list of published or enrolled courses.</p>
    </div>
  )
}
