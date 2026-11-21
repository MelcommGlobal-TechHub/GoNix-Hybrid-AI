import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { getFirebaseAuth } from '../lib/firebase'
import EduPlusLogo from '../components/EduPlusLogo'
import CustomerCare from '../components/CustomerCare'

const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: '⌂' },
  { label: 'Creator Studio', path: '/creator-studio', icon: '✦' },
  { label: 'My Learning', path: '/learning', icon: '▤' },
  { label: 'Student Studio', path: '/student-studio', icon: '✦' },
  { label: 'Lecturer Studio', path: '/lecturer-studio', icon: '◈' },
  { label: 'Courses', path: '/courses', icon: '▧' },
  { label: 'Curriculum', path: '/curriculum', icon: '◎' },
  { label: 'Assessments', path: '/assessments', icon: '✓' },
  { label: 'Certificates', path: '/certificates', icon: '♧' },
  { label: 'Notifications', path: '/notifications', icon: '🔔' },
  { label: 'Messages', path: '/messages', icon: '✉' },
  { label: 'Community', path: '/community', icon: '◎' },
  { label: 'Progress & Skills', path: '/progress', icon: '▥' },
  { label: 'Opportunities', path: '/opportunities', icon: '↗' },
  { label: 'NEXORA Intelligence', path: '/hybrid-ai', icon: '✧' },
  { label: 'NEXORA AI Agent', path: '/ai-agent', icon: '✦' },
  { label: 'Settings', path: '/settings', icon: '⚙' },
]

const ecosystem = [
  { name: 'NEXORA', mark: 'N', status: 'International ecosystem' },
  { name: 'NEXORA Academy', mark: 'NA', status: 'Learning ecosystem' },
  { name: 'NativeMarket', mark: 'N', status: 'Coming soon' },
  { name: 'Arch101', mark: 'A', status: 'Coming soon' },
  { name: 'AgroPlusAI', mark: 'Ag', status: 'Coming soon' },
  { name: 'AgroConsult', mark: 'Ac', status: 'Coming soon' },
  { name: 'SeaGuard AI', mark: 'S', status: 'Coming soon' },
  { name: 'AI Africa Learning Hub', mark: 'AI', status: 'Coming soon' },
]

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  function closeMenu() {
    setMenuOpen(false)
  }

  async function handleSignOut() {
    if (signingOut) return

    setSigningOut(true)
    setSignOutError('')

    try {
      await signOut(getFirebaseAuth())
      closeMenu()
      navigate('/', { replace: true })
    } catch {
      setSignOutError('Sign out failed. Please try again.')
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="edu-shell">
      <header className="edu-header">
        <div className="edu-header-left">
          <button
            className="edu-menu-button"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <Link className="edu-brand" to="/dashboard" onClick={closeMenu}>
            <EduPlusLogo />
          </Link>
        </div>

        <div className="edu-header-right">
          <span className="edu-tagline">THE NEXT ERA STARTS HERE.</span>
          <Link
            className="edu-notification-button"
            to="/notifications"
            aria-label="Open notifications"
            title="Notifications"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>
          </Link>
          <Link className="edu-profile" to="/profile" aria-label="Open profile">
            <span className="edu-avatar" aria-hidden="true">👤</span>
            <span>My Profile</span>
          </Link>
        </div>
      </header>

      {menuOpen && (
        <button
          className="edu-menu-backdrop"
          aria-label="Close navigation"
          onClick={closeMenu}
          type="button"
        />
      )}

      <aside className={`edu-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="edu-sidebar-heading">
          <span>NEXORA NAVIGATION</span>
          <button type="button" onClick={closeMenu} aria-label="Close menu">×</button>
        </div>

        <nav className="edu-navigation" aria-label="Main navigation">
          <Link className="edu-nav-link edu-home-link" to="/" onClick={closeMenu}>
            <span className="edu-nav-icon" aria-hidden="true">⌂</span>
            <span>NEXORA Home</span>
          </Link>

          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }) => `edu-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="edu-nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="edu-sidebar-note">
          <span className="edu-note-icon">✦</span>
          <strong>Learn. Create. Build. Launch.</strong>
          <p>Your connected world of intelligence, creativity and opportunity.</p>
        </div>

        <div className="edu-sidebar-actions">
          {signOutError && <p className="edu-signout-error" role="alert">{signOutError}</p>}
          <button
            type="button"
            className="edu-signout-button"
            onClick={() => void handleSignOut()}
            disabled={signingOut}
          >
            <span aria-hidden="true">↪</span>
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </aside>

      <main className="edu-main" key={location.pathname}>
        <Outlet />
      </main>

      <CustomerCare />

      <footer className="edu-footer">
        <div className="edu-footer-heading">
          <div>
            <span className="edu-kicker">THE CONNECTED ECOSYSTEM</span>
            <h2>Explore the NEXORA ecosystem</h2>
          </div>
          <span className="edu-footer-caption">Innovation, learning and opportunity</span>
        </div>

        <div className="edu-brand-track" aria-label="NEXORA ecosystem brands">
          <div className="edu-brand-track-inner">
            {[...ecosystem, ...ecosystem].map((brand, index) => (
              <div className="edu-brand-tile" key={`${brand.name}-${index}`}>
                <span className="edu-brand-mark">{brand.mark}</span>
                <span className="edu-brand-name">{brand.name}</span>
                <span className="edu-brand-status">{brand.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="edu-footer-bottom">
          <span>NEXORA · The Next Era Starts Here.</span>
          <span>An international AI ecosystem by Melcomm Global</span>
        </div>
      </footer>
    </div>
  )
}
