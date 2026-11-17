import { Link } from 'react-router-dom'

export default function DashboardPage() {
  return (
    <div className="edu-page edu-dashboard-page">
      <section className="edu-dashboard-hero" aria-labelledby="dashboard-heading">
        <div className="edu-dashboard-visual">
          <img
            className="edu-dashboard-hero-image"
            src="/gonix-eduplus-dashboard-hero.png"
            alt="GoNix Hybrid AI: intelligent learning with on-device and cloud AI"
          />

          <Link className="edu-hero-ai-button" to="/hybrid-ai">
            <span aria-hidden="true">✦</span>
            Use AI
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <h1 id="dashboard-heading">
          Learn More. <span>Become More.</span>
        </h1>
      </section>

      <section className="eduplus-welcome" aria-labelledby="eduplus-heading">
        <span className="edu-kicker">YOUR LEARNING JOURNEY</span>
        <h2 id="eduplus-heading">eduPlus</h2>
        <p>
          Build knowledge, practise your skills and take meaningful steps
          towards successful learning and personal growth.
        </p>
        <p className="eduplus-menu-notice">
          <strong>Explore more with GoNix EduPlus.</strong>
          <span>
            Open the menu ☰ to discover your learning spaces, courses,
            Student Studio, Lecturer Studio and other platform features.
          </span>
        </p>
      </section>
    </div>
  )
}
