export type OutputMode = 'text' | 'visual'

export type VisualType =
  | 'infographic'
  | 'diagram'
  | 'flowchart'
  | 'mindmap'
  | 'chart'
  | 'graph'

export type DownloadFormat = 'pdf' | 'docx' | 'txt' | 'png' | 'svg'

export interface VisualNode {
  id: string
  label: string
  description?: string
  type?: 'default' | 'input' | 'process' | 'decision' | 'output'
}

export interface VisualEdge {
  from: string
  to: string
  label?: string
}

export interface ChartSeries {
  name: string
  values: number[]
}

export interface ChartData {
  labels: string[]
  series: ChartSeries[]
  unit?: string
  dataOrigin: 'user-provided' | 'source-provided' | 'illustrative'
}

export interface VisualResult {
  type: VisualType
  title: string
  explanation: string
  nodes?: VisualNode[]
  edges?: VisualEdge[]
  chart?: ChartData
  mermaid?: string
  imageData?: string
  imageMimeType?: string
  inferenceSource: 'on_device' | 'in_cloud'
  warnings: string[]
}

export interface TextResult {
  title: string
  content: string
  inferenceSource: 'on_device' | 'in_cloud'
}
