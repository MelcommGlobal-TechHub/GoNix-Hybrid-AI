import { Link } from 'react-router-dom'

const courses = [
  { title: 'Introduction to Artificial Intelligence', category: 'Artificial Intelligence', progress: 65, lessons: 12, completed: 8, icon: '✦' },
  { title: 'Web Development Fundamentals', category: 'Technology', progress: 35, lessons: 20, completed: 7, icon: '⌘' },
  { title: 'Digital Skills and Productivity', category: 'Digital Skills', progress: 0, lessons: 10, completed: 0, icon: '▤' },
]

export default function LearningPage() {
  const completed = courses.reduce((sum, course) => sum + course.completed, 0)
  const total = courses.reduce((sum, course) => sum + course.lessons, 0)

  return (
    <div className="edu-page edu-learning-page">
      <section className="edu-page-hero">
        <span className="edu-kicker">YOUR LEARNING JOURNEY</span>
        <h1>My <span>Learning</span></h1>
        <p>Continue your courses, develop practical skills and keep moving towards your learning goals.</p>
        <Link className="edu-primary-link" to="/courses">Explore courses →</Link>
      </section>

      <div className="edu-stat-grid">
        <article className="edu-stat-card"><span>ENROLLED COURSES</span><strong>{courses.length}</strong><small>Sample learning data</small></article>
        <article className="edu-stat-card"><span>LESSONS COMPLETED</span><strong>{completed}</strong><small>Across sample courses</small></article>
        <article className="edu-stat-card"><span>TOTAL LESSONS</span><strong>{total}</strong><small>In this sample catalogue</small></article>
      </div>

      <section className="edu-section-heading">
        <span className="edu-kicker">YOUR CLASSROOM</span>
        <h2>Continue learning</h2>
        <p>These sample courses demonstrate the learning interface. Real enrolments will require account and database integration.</p>
      </section>

      <div className="edu-course-grid">
        {courses.map(course => (
          <article className="edu-course-card" key={course.title}>
            <div className="edu-course-icon">{course.icon}</div>
            <span className="edu-course-category">{course.category}</span>
            <h3>{course.title}</h3>
            <p>{course.completed} of {course.lessons} lessons completed</p>
            <div className="edu-progress-track"><span style={{ width: `${course.progress}%` }} /></div>
            <strong>{course.progress}% complete</strong>
            <Link to="/courses" className="edu-card-link">View course →</Link>
          </article>
        ))}
      </div>
    </div>
  )
}
