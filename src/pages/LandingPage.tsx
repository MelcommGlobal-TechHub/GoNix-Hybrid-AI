import { Link } from 'react-router-dom'
import { themeOptions, useAISettings } from '../context/AISettingsContext'
import './LandingPage.css'

const COPYRIGHT_YEAR = new Date().getFullYear()

const products = [
  {
    icon: '✦',
    name: 'Nexora Intelligence',
    category: 'ARTIFICIAL INTELLIGENCE',
    description: 'Experience hybrid AI that brings intelligent assistance, productivity and on-device and cloud-powered capabilities together.',
    features: 'AI assistants · Hybrid inference · Smart productivity',
    link: '/hybrid-ai',
    action: 'Explore AI',
    status: 'Available',
  },
  {
    icon: '⌘',
    name: 'Nexora Academy',
    category: 'EDUCATION & LEARNING',
    description: 'Learn new skills, explore courses, prepare for examinations and discover new opportunities through intelligent learning.',
    features: 'Courses · Learning studios · Assessments',
    link: '/learning',
    action: 'Start learning',
    status: 'Available',
  },
  {
    icon: '✧',
    name: 'Nexora Create',
    category: 'CREATIVE TECHNOLOGY',
    description: 'A growing creative environment for people who want to transform imagination into digital experiences and content.',
    features: 'Creative tools · Digital content · Creator opportunities',
    link: '/student-studio',
    action: 'Explore studio',
    status: 'Expanding',
  },
  {
    icon: '</>',
    name: 'Nexora Developers',
    category: 'SOFTWARE & DEVELOPMENT',
    description: 'Our vision for a connected developer workspace: build websites and applications, then connect hosting, domains and cloud services.',
    features: 'AI website builder · App builder · Hosting and domains',
    link: '/register',
    action: 'Enter platform',
    status: 'In development',
  },
  {
    icon: '▣',
    name: 'Nexora Games',
    category: 'GAMES & INTERACTIVE MEDIA',
    description: 'Explore the future of game creation, interactive experiences, game assets and publishing.',
    features: 'Game creation · Prototypes · Digital assets',
    link: '/register',
    action: 'Discover Nexora',
    status: 'Coming soon',
  },
  {
    icon: '⌂',
    name: 'Nexora Architecture',
    category: 'ARCHITECTURE & DESIGN',
    description: 'An expanding architecture workspace built around the ARCh101 vision for architectural concepts and digital design.',
    features: 'Architectural concepts · 3D design · Building workflows',
    link: '/register',
    action: 'Discover Nexora',
    status: 'Expanding',
  },
  {
    icon: '♜',
    name: 'Nexora Arena',
    category: 'COMPETITIONS & INNOVATION',
    description: 'A destination for challenges, hackathons, creative competitions and opportunities to showcase your talent.',
    features: 'Challenges · Hackathons · Recognition',
    link: '/opportunities',
    action: 'Explore opportunities',
    status: 'Expanding',
  },
  {
    icon: '◇',
    name: 'Nexora Market',
    category: 'DIGITAL COMMERCE',
    description: 'A planned marketplace connecting creators, developers, learners and customers through digital products and services.',
    features: 'Digital products · Templates · Creator commerce',
    link: '/register',
    action: 'Discover Nexora',
    status: 'Coming soon',
  },
  {
    icon: '▤',
    name: 'Nexora Campus',
    category: 'INSTITUTIONS',
    description: 'A connected institutional vision for schools, universities, lecturers, learners and education organisations.',
    features: 'Institutional learning · Academic tools · Collaboration',
    link: '/courses',
    action: 'Explore learning',
    status: 'Expanding',
  },
]

const benefits = [
  {
    icon: '◎',
    title: 'One connected ecosystem',
    text: 'Move between learning, intelligence, creativity and innovation through one growing platform.',
  },
  {
    icon: '✦',
    title: 'Intelligence with flexibility',
    text: 'Experience a hybrid AI approach designed to use on-device capabilities where supported and cloud AI where permitted.',
  },
  {
    icon: '↗',
    title: 'Built around opportunity',
    text: 'Discover learning pathways, creative possibilities, competitions and future digital commerce.',
  },
  {
    icon: '◈',
    title: 'Designed for global access',
    text: 'An international vision for people, creators, developers and institutions across regions.',
  },
]

export default function LandingPage() {
  const { theme, setTheme } = useAISettings()
  return (
    <div className="nexora-landing">
      <header className="nx-header">
        <Link to="/" className="nx-brand" aria-label="NEXORA home">
          <span className="nx-brand-symbol">N</span>
          <span>NEXORA</span>
        </Link>

        <nav className="nx-nav" aria-label="Main navigation">
          <a href="#ecosystem">Ecosystem</a>
          <a href="#why-nexora">Why NEXORA</a>
          <a href="#institutions">Institutions</a>
        </nav>

        <div className="nx-header-actions">
          <label className="nx-theme-control">Theme<select className="nx-theme-select" aria-label="Choose appearance theme" value={theme} onChange={(event) => setTheme(event.target.value as typeof theme)}>{themeOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
          <Link to="/login" className="nx-login-link">Sign in</Link>
          <Link to="/register" className="nx-header-cta">Get started <span>→</span></Link>
        </div>
      </header>

      <main>
        <section className="nx-hero">
          <div className="nx-hero-glow" aria-hidden="true" />
          <div className="nx-hero-content">
            <span className="nx-eyebrow"><i /> THE INTERNATIONAL AI ECOSYSTEM</span>
            <h1>Your ideas deserve<br />a <span>bigger future.</span></h1>
            <p>
              Learn new skills. Create extraordinary things. Build digital
              products. Explore intelligent technology. Discover a world of
              opportunities — all through one connected ecosystem.
            </p>
            <div className="nx-hero-actions">
              <Link to="/register" className="nx-button nx-button-primary">
                Explore NEXORA <span>→</span>
              </Link>
              <a href="#ecosystem" className="nx-button nx-button-secondary">
                Discover the ecosystem
              </a>
            </div>
            <div className="nx-hero-proof">
              <span><b>01</b> Learn</span>
              <span><b>02</b> Create</span>
              <span><b>03</b> Build</span>
              <span><b>04</b> Compete</span>
              <span><b>05</b> Grow</span>
            </div>
          </div>

          <div className="nx-orbit-art" aria-label="NEXORA connected technology concept">
            <div className="nx-orbit nx-orbit-one" />
            <div className="nx-orbit nx-orbit-two" />
            <div className="nx-orbit-core">
              <span className="nx-core-symbol">N</span>
              <span className="nx-core-name">NEXORA</span>
              <small>THE NEXT ERA STARTS HERE</small>
            </div>
            <span className="nx-orbit-node nx-node-one">AI</span>
            <span className="nx-orbit-node nx-node-two">✦</span>
            <span className="nx-orbit-node nx-node-three">⌘</span>
            <span className="nx-orbit-node nx-node-four">∞</span>
          </div>
          <div className="nx-hero-bottom">
            <span>ONE ECOSYSTEM</span>
            <span>INTELLIGENCE WITHOUT BOUNDARIES</span>
            <span>BUILT FOR WHAT'S NEXT</span>
          </div>
        </section>

        <section className="nx-intro" id="why-nexora">
          <div>
            <span className="nx-section-label">A NEW WAY TO MOVE FORWARD</span>
            <h2>Everything you need to turn <span>possibility into progress.</span></h2>
          </div>
          <p>
            NEXORA brings multiple areas of digital life together. Whether
            you're a student, creator, developer, professional or institution,
            there's a place for your next idea.
          </p>
        </section>

        <section className="nx-benefits">
          {benefits.map((benefit) => (
            <article className="nx-benefit" key={benefit.title}>
              <span className="nx-benefit-icon">{benefit.icon}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </section>

        <section className="nx-ecosystem" id="ecosystem">
          <div className="nx-section-heading">
            <div>
              <span className="nx-section-label">EXPLORE THE POSSIBILITIES</span>
              <h2>One ecosystem. <span>Many possibilities.</span></h2>
              <p>Discover the products and services taking shape across NEXORA.</p>
            </div>
            <Link to="/login" className="nx-text-link">Sign in to NEXORA →</Link>
          </div>

          <div className="nx-product-grid">
            {products.map((product, index) => (
              <article className="nx-product-card" key={product.name}>
                <div className="nx-product-top">
                  <span className={`nx-product-icon nx-product-icon-${index % 5}`}>
                    {product.icon}
                  </span>
                  <span className={`nx-status nx-status-${product.status.toLowerCase().replaceAll(' ', '-')}`}>
                    {product.status}
                  </span>
                </div>
                <span className="nx-product-category">{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="nx-product-features">{product.features}</div>
                <Link to={product.link} className="nx-product-link">
                  {product.action} <span>→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="nx-intelligence">
          <div className="nx-intelligence-visual">
            <div className="nx-ai-window">
              <div className="nx-window-bar"><i /><i /><i /><span>NEXORA INTELLIGENCE</span></div>
              <div className="nx-ai-content">
                <span className="nx-ai-chip">HYBRID AI</span>
                <div className="nx-ai-orb">✦</div>
                <strong>Intelligence that adapts.</strong>
                <p>On-device when supported. Cloud when permitted.</p>
                <div className="nx-ai-lines"><i /><i /><i /></div>
              </div>
            </div>
          </div>
          <div className="nx-intelligence-copy">
            <span className="nx-section-label">POWERED BY INTELLIGENCE</span>
            <h2>AI that helps you <span>think bigger.</span></h2>
            <p>
              Explore a hybrid AI experience designed to bring together
              supported on-device intelligence and consent-based cloud
              inference. Create, learn, research and get more done.
            </p>
            <ul>
              <li>Flexible inference modes</li>
              <li>On-device capability checks</li>
              <li>Cloud use with explicit consent</li>
              <li>AI-powered learning and productivity</li>
            </ul>
            <Link to="/hybrid-ai" className="nx-button nx-button-primary">
              Explore Hybrid AI <span>→</span>
            </Link>
          </div>
        </section>

        <section className="nx-audience" id="institutions">
          <div className="nx-section-heading">
            <div>
              <span className="nx-section-label">MADE FOR PEOPLE WITH IDEAS</span>
              <h2>There's a place for <span>you at NEXORA.</span></h2>
            </div>
          </div>
          <div className="nx-audience-grid">
            <article><span>01</span><h3>Students & learners</h3><p>Build knowledge, practise skills and explore new learning pathways.</p></article>
            <article><span>02</span><h3>Creators & professionals</h3><p>Bring ideas to life and develop your digital capabilities.</p></article>
            <article><span>03</span><h3>Developers & innovators</h3><p>Explore tools and opportunities to turn concepts into products.</p></article>
            <article><span>04</span><h3>Schools & institutions</h3><p>Discover the potential of connected, intelligent learning experiences.</p></article>
          </div>
        </section>

        <section className="nx-cta">
          <span className="nx-section-label">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>Don't just imagine the future.<br /><span>Build your place in it.</span></h2>
          <p>Step into an ecosystem created for learning, creativity, technology and opportunity.</p>
          <Link to="/register" className="nx-button nx-button-primary">
            Enter NEXORA <span>→</span>
          </Link>
          <small>Learn. Create. Build. Launch. Compete. Earn.</small>
        </section>
      </main>

      <footer className="nx-footer">
        <div className="nx-footer-main">
          <div>
            <Link to="/" className="nx-brand"><span className="nx-brand-symbol">N</span><span>NEXORA</span></Link>
            <p>The next era starts here. An international AI ecosystem for learning, creativity, development and opportunity.</p>
          </div>
          <div className="nx-footer-links">
            <strong>Explore</strong>
            <a href="#ecosystem">Our ecosystem</a>
            <Link to="/hybrid-ai">Hybrid AI</Link>
            <Link to="/learning">Learning</Link>
            <Link to="/opportunities">Opportunities</Link>
          </div>
          <div className="nx-footer-links">
            <strong>Platform</strong>
            <Link to="/login">Sign in</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/student-studio">Creative studio</Link>
            <Link to="/settings">Settings</Link>
          </div>
        </div>
        <div className="nx-footer-bottom">
          <span>© {COPYRIGHT_YEAR} NEXORA. All rights reserved.</span>
          <span>An initiative of Melcomm Global</span>
        </div>
      </footer>
    </div>
  )
}
