import type {
  CreatorEnvironment,
  CreatorStudioDefinition,
  EngineProviderAdapter,
} from './types'

export const creatorStudios = [
  {
    id: 'video',
    title: 'Video Studio',
    shortDescription: 'Create cinematic videos and connected scenes.',
    description: 'Plan, generate and assemble cinematic productions with storyboards, scene continuity, camera direction, voiceovers and editing.',
    outputs: ['Video clips', 'Storyboards', 'Scene sequences', 'Finished productions'],
    capabilities: ['text-to-video', 'image-to-video', 'storyboard', 'video-editing', 'voice-generation'],
  },
  {
    id: 'music',
    title: 'Music Studio',
    shortDescription: 'Create songs, instrumentals and audio.',
    description: 'Develop original music projects with lyrics, vocals, instrumentals, sound effects and audio editing.',
    outputs: ['Songs', 'Instrumentals', 'Voice tracks', 'Sound effects'],
    capabilities: ['text-to-music', 'audio-generation', 'audio-editing', 'voice-generation'],
  },
  {
    id: 'image',
    title: 'Image Studio',
    shortDescription: 'Generate and transform visual content.',
    description: 'Create and edit images using text prompts, reference images, visual styles and image-to-image workflows.',
    outputs: ['Images', 'Design assets', 'Edited images', 'Visual concepts'],
    capabilities: ['text-to-image', 'image-to-image', 'image-editing'],
  },
  {
    id: 'apps',
    title: 'App Studio',
    shortDescription: 'Plan and develop applications.',
    description: 'Build application concepts, interfaces, application code, tests and implementation plans.',
    outputs: ['Application prototypes', 'Source code', 'UI components', 'Test plans'],
    capabilities: ['code-generation', 'app-prototyping', 'application-testing'],
  },
  {
    id: 'websites',
    title: 'Website Studio',
    shortDescription: 'Design and build modern websites.',
    description: 'Create websites, landing pages and web applications, with code generation and deployment preparation.',
    outputs: ['Websites', 'Landing pages', 'Web applications', 'Source code'],
    capabilities: ['website-generation', 'code-generation', 'deployment'],
  },
  {
    id: 'ebooks',
    title: 'eBook Studio',
    shortDescription: 'Write, design and prepare books.',
    description: 'Develop book outlines, chapters, manuscripts, covers and publication-ready documents.',
    outputs: ['eBooks', 'Manuscripts', 'Book outlines', 'Formatted documents'],
    capabilities: ['long-form-writing', 'document-formatting', 'publishing'],
  },
  {
    id: 'articles',
    title: 'Article Studio',
    shortDescription: 'Research, write and edit articles.',
    description: 'Create editorial drafts, blog posts, explainers and research-supported articles with clear source attribution.',
    outputs: ['Articles', 'Blog posts', 'Editorial drafts', 'Research summaries'],
    capabilities: ['writing', 'research-assistance', 'editing'],
  },
  {
    id: 'handouts',
    title: 'Handout Studio',
    shortDescription: 'Prepare educational and learning materials.',
    description: 'Produce lesson handouts, revision notes, worksheets, learning guides and assessment materials.',
    outputs: ['Handouts', 'Revision notes', 'Worksheets', 'Learning guides'],
    capabilities: ['educational-content', 'document-formatting', 'assessment-generation'],
  },
] as const satisfies readonly CreatorStudioDefinition[]

export const creatorEnvironments: readonly CreatorEnvironment[] = [
  {
    id: 'on-device',
    label: 'On-device',
    description: 'Run supported models locally when the device and model permit.',
    status: 'planned',
  },
  {
    id: 'cloud',
    label: 'Cloud',
    description: 'Use secure cloud integrations with explicit consent and usage controls.',
    status: 'planned',
  },
  {
    id: 'provider-hosted',
    label: 'Provider-hosted',
    description: 'Use specialist provider environments through secure server integrations.',
    status: 'planned',
  },
]

// Providers are registered only after their integrations have been implemented
// and verified. Never put private provider credentials in this registry.
export const engineProviders: readonly EngineProviderAdapter[] = []
