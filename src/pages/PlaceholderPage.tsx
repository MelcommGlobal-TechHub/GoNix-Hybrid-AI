import { Link, useLocation } from 'react-router-dom'

const pageDetails: Record<string, { title: string; description: string }> = {
  '/learning': {
    title: 'My Learning',
    description: 'Your courses, lessons, learning paths and progress will be organised here.',
  },
  '/student-studio': {
    title: 'Student Studio',
    description: 'A dedicated learner workspace for practice, projects and guided study.',
  },
  '/lecturer-studio': {
    title: 'Lecturer Studio',
    description: 'A workspace for educators to prepare learning materials and support learners.',
  },
  '/courses': {
    title: 'Courses',
    description: 'Explore structured courses, lessons and practical learning experiences.',
  },
  '/curriculum': {
    title: 'Curriculum and Exam Pathways',
    description: 'Country-aware curriculum pathways will be introduced with source verification and version information.',
  },
  '/assessments': {
    title: 'Assessments',
    description: 'Quizzes, practice activities, assignments and secure assessment experiences.',
  },
  '/certificates': {
    title: 'Certificates',
    description: 'View and verify learning achievements when certificate services are connected.',
  },
  '/opportunities': {
    title: 'Opportunities',
    description: 'Discover projects, skills pathways and opportunities connected to learning.',
  },
  '/profile': {
    title: 'My Profile',
    description: 'Your real account details, country, education preferences and learning settings will appear here after authentication is connected.',
  },
  '/settings': {
    title: 'Settings',
    description: 'Manage your learning preferences, accessibility, language and account settings.',
  },
}

export default function PlaceholderPage() {
  const { pathname } = useLocation()
  const page = pageDetails[pathname] ?? {
    title: 'GoNix EduPlus',
    description: 'This learning space is being prepared.',
  }

  const isStudio = pathname === '/student-studio' || pathname === '/lecturer-studio'

  return (
    <div className="edu-page">
      <section className="edu-placeholder">
        <span className="edu-kicker">GONIX EDUPLUS WORKSPACE</span>
        <h1>{page.title}</h1>
        <p className="edu-muted">{page.description}</p>
        <span className="edu-status-label">FOUNDATION IN DEVELOPMENT</span>

        {isStudio && (
          <div>
            <p className="edu-muted">
              You can open the central AI workspace. Studio-specific course
              context and permissions will be connected in a later stage.
            </p>
            <Link
              className="edu-primary-link"
              to="/hybrid-ai"
              state={{ sourceStudio: pathname }}
            >
              Open GoNix Hybrid AI <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
