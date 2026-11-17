import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import './AppShell.css'
import EduPlusLogo from '../components/EduPlusLogo'
import CustomerCare from '../components/CustomerCare'

const navigation = [
  { label: 'Dashboard', path: '/', icon: '⌂' },
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
  { label: 'GoNix Hybrid AI', path: '/hybrid-ai', icon: '✧' },
  { label: 'GoNix AI Agent', path: '/ai-agent', icon: '✦' },
  { label: 'Settings', path: '/settings', icon: '⚙' },
]

const ecosystem = [
  { name: 'GoNix', mark: 'G', status: 'Ecosystem' },
  { name: 'GoNix EduPlus', mark: 'E+', status: 'Current platform' },
  { name: 'NativeMarket', mark: 'N', status: 'Coming soon' },
  { name: 'Arch101', mark: 'A', status: 'Coming soon' },
  { name: 'AgroPlusAI', mark: 'Ag', status: 'Coming soon' },
  { name: 'AgroConsult', mark: 'Ac', status: 'Coming soon' },
  { name: 'SeaGuard AI', mark: 'S', status: 'Coming soon' },
  { name: 'AI Africa Learning Hub', mark: 'AI', status: 'Coming soon' },
]

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  function closeMenu() {
    setMenuOpen(false)
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

          <Link className="edu-brand" to="/" onClick={closeMenu}>
            <EduPlusLogo />
          </Link>
        </div>

        <div className="edu-header-right">
          <span className="edu-tagline">LEARN MORE. BECOME MORE.</span>
          <Link className="edu-notification-button" to="/notifications" aria-label="Open notifications" title="Notifications">
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
          <span>LEARNING SPACE</span>
          <button type="button" onClick={closeMenu} aria-label="Close menu">×</button>
        </div>

        <nav className="edu-navigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
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
          <strong>Learn. Practise. Grow.</strong>
          <p>Your learning journey, connected to intelligent tools and opportunities.</p>
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
            <h2>Explore the GoNix family</h2>
          </div>
          <span className="edu-footer-caption">Innovation, learning and opportunity</span>
        </div>

        <div className="edu-brand-track" aria-label="GoNix ecosystem brands">
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
          <span>GoNix EduPlus · Learn More. Become More.</span>
          <span>Powered by B12 TechHub · GoNix Ecosystem</span>
        </div>
      </footer>
    </div>
  )
}
