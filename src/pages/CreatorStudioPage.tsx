import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  creatorEnvironments,
  creatorStudios,
  engineProviders,
} from '../lib/creator-studio/catalog'
import type { EngineCapability } from '../lib/creator-studio/types'
import './CreatorStudioPage.css'

const capabilityLabels: Record<EngineCapability, string> = {
  'text-to-video': 'Text-to-video',
  'image-to-video': 'Image-to-video',
  storyboard: 'Storyboarding',
  'video-editing': 'Video editing',
  'text-to-music': 'Text-to-music',
  'audio-generation': 'Audio generation',
  'audio-editing': 'Audio editing',
  'voice-generation': 'Voice generation',
  'text-to-image': 'Text-to-image',
  'image-to-image': 'Image-to-image',
  'image-editing': 'Image editing',
  'code-generation': 'Code generation',
  'app-prototyping': 'App prototyping',
  'application-testing': 'Application testing',
  'website-generation': 'Website generation',
  deployment: 'Deployment',
  'long-form-writing': 'Long-form writing',
  'document-formatting': 'Document formatting',
  publishing: 'Publishing',
  writing: 'Writing',
  'research-assistance': 'Research assistance',
  editing: 'Editing',
  'educational-content': 'Educational content',
  'assessment-generation': 'Assessment generation',
}

export default function CreatorStudioPage() {
  const { studio: studioParam } = useParams<{ studio: string }>()
  const [search, setSearch] = useState('')

  const activeStudio = creatorStudios.find((item) => item.id === studioParam)

  const filteredStudios = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return creatorStudios

    return creatorStudios.filter((item) =>
      `${item.title} ${item.shortDescription} ${item.outputs.join(' ')}`
        .toLowerCase()
        .includes(query),
    )
  }, [search])

  if (studioParam && !activeStudio) {
    return (
      <div className="edu-page creator-studio-page">
        <section className="creator-studio-hero">
          <span className="edu-kicker">NEXORA CREATOR STUDIO</span>
          <h1>Studio not found</h1>
          <p>This workspace does not exist in the current studio catalogue.</p>
          <Link className="edu-primary-link" to="/creator-studio">
            Explore Creator Studio →
          </Link>
        </section>
      </div>
    )
  }

  if (activeStudio) {
    const compatibleProviders = engineProviders.filter((provider) =>
      activeStudio.capabilities.some((capability) =>
        provider.capabilities.includes(capability),
      ),
    )

    return (
      <div className="edu-page creator-studio-page">
        <Link className="creator-studio-back" to="/creator-studio">
          ← All creation studios
        </Link>

        <section className="creator-studio-hero">
          <span className="edu-kicker">NEXORA CREATOR STUDIO / WORKSPACE</span>
          <h1>{activeStudio.title}</h1>
          <p>{activeStudio.description}</p>
          <span className="creator-studio-status">FOUNDATION IN DEVELOPMENT</span>
        </section>

        <section className="creator-studio-section">
          <div className="creator-studio-section-heading">
            <div>
              <span className="edu-kicker">PRODUCTION CAPABILITIES</span>
              <h2>What this studio is designed to do</h2>
            </div>
          </div>
          <div className="creator-studio-tags">
            {activeStudio.capabilities.map((capability) => (
              <span key={capability}>
                {capabilityLabels[capability]}
              </span>
            ))}
          </div>
        </section>

        <section className="creator-studio-section">
          <span className="edu-kicker">EXPECTED OUTPUTS</span>
          <div className="creator-studio-output-grid">
            {activeStudio.outputs.map((output) => (
              <div className="creator-studio-output" key={output}>
                <span aria-hidden="true">✦</span>
                {output}
              </div>
            ))}
          </div>
        </section>

        <section className="creator-studio-section creator-studio-engine-panel">
          <span className="edu-kicker">AI ENGINE CONNECTIONS</span>
          <h2>
            {compatibleProviders.length
              ? 'Compatible provider integrations'
              : 'No connected engines yet'}
          </h2>
          <p>
            {compatibleProviders.length
              ? 'Provider integrations will be listed here with their verified capabilities.'
              : 'This workspace has no registered provider integrations yet. Engines will only appear here after secure integration and capability testing.'}
          </p>
          <span className="creator-studio-status">
            {compatibleProviders.length} verified integrations
          </span>
        </section>
      </div>
    )
  }

  return (
    <div className="edu-page creator-studio-page">
      <section className="creator-studio-hero">
        <span className="edu-kicker">LEARN · CREATE · BUILD · PUBLISH</span>
        <h1>NEXORA <span>Creator Studio</span></h1>
        <p>
          One creative ecosystem for producing videos, music, images,
          applications, websites, books, articles and educational materials.
          Choose a workspace and build with the engines that best suit your work.
        </p>
        <div className="creator-studio-hero-meta">
          <span>8 specialized workspaces</span>
          <span>Shared engine architecture</span>
          <span>Switchable environments planned</span>
        </div>
      </section>

      <section className="creator-studio-section">
        <div className="creator-studio-section-heading">
          <div>
            <span className="edu-kicker">YOUR CREATIVE WORKSPACES</span>
            <h2>What do you want to create?</h2>
          </div>
          <span className="creator-studio-count">
            {filteredStudios.length} studios
          </span>
        </div>

        <label className="creator-studio-search">
          <span>Find a studio</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search video, music, apps, books..."
          />
        </label>

        <div className="creator-studio-grid">
          {filteredStudios.map((item, index) => (
            <Link
              className="creator-studio-card"
              to={`/creator-studio/${item.id}`}
              key={item.id}
            >
              <span className="creator-studio-card-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{item.title}</h3>
              <p>{item.shortDescription}</p>
              <span className="creator-studio-card-action">
                Explore workspace →
              </span>
            </Link>
          ))}
        </div>

        {filteredStudios.length === 0 && (
          <p className="edu-empty-state">
            No studios match that search. Try another keyword.
          </p>
        )}
      </section>

      <section className="creator-studio-section">
        <div className="creator-studio-section-heading">
          <div>
            <span className="edu-kicker">SHARED INFRASTRUCTURE</span>
            <h2>Switchable AI environments</h2>
          </div>
        </div>
        <div className="creator-studio-environment-grid">
          {creatorEnvironments.map((environment) => (
            <article className="creator-studio-environment" key={environment.id}>
              <span className="creator-studio-status">PLANNED</span>
              <h3>{environment.label}</h3>
              <p>{environment.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="creator-studio-section creator-studio-engine-panel">
        <span className="edu-kicker">PROVIDER MANAGEMENT</span>
        <h2>One workspace. Multiple AI engines.</h2>
        <p>
          Provider adapters will let each studio select compatible models,
          compare available capabilities and switch engines without losing
          project data.
        </p>
        <div className="creator-studio-engine-stats">
          <div>
            <strong>{engineProviders.length}</strong>
            <span>Verified provider connections</span>
          </div>
          <div>
            <strong>{creatorStudios.length}</strong>
            <span>Studio workspaces</span>
          </div>
        </div>
        <p className="creator-studio-footnote">
          No external AI provider is currently registered in this new studio
          catalogue. Existing NEXORA hybrid AI remains separate and unchanged.
          Paid generation will require cost disclosure and user confirmation.
        </p>
      </section>
    </div>
  )
}
