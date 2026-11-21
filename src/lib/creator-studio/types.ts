export type StudioId =
  | 'video'
  | 'music'
  | 'image'
  | 'apps'
  | 'websites'
  | 'ebooks'
  | 'articles'
  | 'handouts'

export type EngineCapability =
  | 'text-to-video'
  | 'image-to-video'
  | 'storyboard'
  | 'video-editing'
  | 'text-to-music'
  | 'audio-generation'
  | 'audio-editing'
  | 'voice-generation'
  | 'text-to-image'
  | 'image-to-image'
  | 'image-editing'
  | 'code-generation'
  | 'app-prototyping'
  | 'application-testing'
  | 'website-generation'
  | 'deployment'
  | 'long-form-writing'
  | 'document-formatting'
  | 'publishing'
  | 'writing'
  | 'research-assistance'
  | 'editing'
  | 'educational-content'
  | 'assessment-generation'

export type ExecutionEnvironmentId =
  | 'on-device'
  | 'cloud'
  | 'provider-hosted'

export type IntegrationStatus =
  | 'not-connected'
  | 'connected'
  | 'degraded'
  | 'unavailable'

export interface CreatorStudioDefinition {
  id: StudioId
  title: string
  shortDescription: string
  description: string
  outputs: readonly string[]
  capabilities: readonly EngineCapability[]
}

export interface CreatorEnvironment {
  id: ExecutionEnvironmentId
  label: string
  description: string
  status: 'planned' | 'available' | 'unavailable'
}

export interface EngineProviderAdapter {
  id: string
  displayName: string
  capabilities: readonly EngineCapability[]
  environments: readonly ExecutionEnvironmentId[]
  status: IntegrationStatus
  serverSideOnly: true
}

export type GenerationJobStatus =
  | 'draft'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
