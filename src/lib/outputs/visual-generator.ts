import { InferenceSource } from 'firebase/ai'
import { runHybridInference, type HybridMode } from '../hybrid-ai'
import type { VisualResult, VisualType, VisualNode, VisualEdge, ChartData } from './types'

interface VisualPayload {
  type: VisualType
  title: string
  explanation: string
  nodes?: VisualNode[]
  edges?: VisualEdge[]
  chart?: ChartData
}

const ALLOWED_TYPES: VisualType[] = [
  'infographic',
  'diagram',
  'flowchart',
  'mindmap',
  'chart',
  'graph',
]

function extractJson(text: string): unknown {
  const cleaned = text.trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')

  return JSON.parse(cleaned)
}

function validatePayload(value: unknown, requestedType: VisualType, userPrompt: string): VisualPayload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('The AI returned an invalid visual structure.')
  }

  const data = value as Record<string, unknown>

  if (data.type !== requestedType || !ALLOWED_TYPES.includes(data.type as VisualType)) {
    throw new Error('The generated visual does not match the selected visual type.')
  }

  if (
    typeof data.title !== 'string' ||
    typeof data.explanation !== 'string' ||
    !data.title.trim() ||
    !data.explanation.trim()
  ) {
    throw new Error('The visual is missing its title or explanation.')
  }

  const isChart = requestedType === 'chart' || requestedType === 'graph'

  if (isChart) {
    if (!data.chart || typeof data.chart !== 'object' || Array.isArray(data.chart)) {
      throw new Error('A chart or graph must include valid chart data.')
    }

    const chart = data.chart as Record<string, unknown>

    if (
      !Array.isArray(chart.labels) ||
      chart.labels.length === 0 ||
      chart.labels.length > 30 ||
      !Array.isArray(chart.series) ||
      chart.series.length === 0 ||
      chart.series.length > 8
    ) {
      throw new Error('The chart has an invalid data structure.')
    }

    if (!chart.labels.every(
      (label) => typeof label === 'string' && label.trim().length > 0,
    )) {
      throw new Error('The chart contains invalid labels.')
    }

    if (
      chart.dataOrigin !== 'user-provided' &&
      chart.dataOrigin !== 'illustrative'
    ) {
      throw new Error('The chart data origin is not permitted.')
    }

    if (
      chart.dataOrigin === 'illustrative' &&
      !/\b(example|sample|illustrat|demonstrat|hypothetical|mock)\b/i.test(
        userPrompt,
      )
    ) {
      throw new Error('Illustrative chart values require an explicit request for sample or demonstration data.')
    }

    if (
      chart.unit !== undefined &&
      (typeof chart.unit !== 'string' || chart.unit.length > 40)
    ) {
      throw new Error('The chart unit is invalid.')
    }

    for (const item of chart.series) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        throw new Error('The chart contains an invalid data series.')
      }

      const series = item as Record<string, unknown>

      if (
        typeof series.name !== 'string' ||
        !series.name.trim() ||
        series.name.length > 80 ||
        !Array.isArray(series.values) ||
        series.values.length !== chart.labels.length ||
        !series.values.every(
          (number) => typeof number === 'number' && Number.isFinite(number),
        )
      ) {
        throw new Error('The chart contains invalid numerical data.')
      }
    }
  } else {
    if (!Array.isArray(data.nodes) || data.nodes.length === 0 || data.nodes.length > 40) {
      throw new Error('This visual requires between 1 and 40 valid nodes.')
    }

    const ids = new Set<string>()

    for (const item of data.nodes) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        throw new Error('The visual contains an invalid node.')
      }

      const node = item as Record<string, unknown>

      if (
        typeof node.id !== 'string' ||
        !node.id.trim() ||
        node.id.length > 80 ||
        typeof node.label !== 'string' ||
        !node.label.trim() ||
        node.label.length > 120 ||
        ids.has(node.id)
      ) {
        throw new Error('The visual contains an invalid or duplicate node.')
      }

      if (
        node.description !== undefined &&
        (typeof node.description !== 'string' || node.description.length > 500)
      ) {
        throw new Error('A visual node has an invalid description.')
      }

      if (
        node.type !== undefined &&
        !['default', 'input', 'process', 'decision', 'output'].includes(
          node.type as string,
        )
      ) {
        throw new Error('A visual node has an unsupported type.')
      }

      ids.add(node.id)
    }

    if (data.edges !== undefined) {
      if (!Array.isArray(data.edges) || data.edges.length > 80) {
        throw new Error('The visual contains too many connections.')
      }

      for (const item of data.edges) {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          throw new Error('The visual contains an invalid connection.')
        }

        const edge = item as Record<string, unknown>

        if (
          typeof edge.from !== 'string' ||
          typeof edge.to !== 'string' ||
          !ids.has(edge.from) ||
          !ids.has(edge.to) ||
          (edge.label !== undefined &&
            (typeof edge.label !== 'string' || edge.label.length > 100))
        ) {
          throw new Error('A visual connection is invalid or refers to an unknown node.')
        }
      }
    }
  }

  return {
    type: requestedType,
    title: data.title,
    explanation: data.explanation,
    nodes: data.nodes as VisualNode[] | undefined,
    edges: data.edges as VisualEdge[] | undefined,
    chart: data.chart as ChartData | undefined,
  }
}
export async function generateVisualResult(
  userPrompt: string,
  visualType: VisualType,
  mode: HybridMode,
  cloudConsent: boolean,
): Promise<VisualResult> {
  if (!ALLOWED_TYPES.includes(visualType)) {
    throw new Error(
      'AI-generated illustrations are not enabled yet. Structured visual formats are available.',
    )
  }

  const instruction = `
Create a structured visual response for the user's request.

Return ONLY valid JSON. Do not use Markdown fences or additional commentary.

Required JSON structure:
{
  "type": "${visualType}",
  "title": "Short descriptive title",
  "explanation": "Clear explanation of the visual",
  "nodes": [
    {
      "id": "unique_id",
      "label": "Short label",
      "description": "Optional explanation",
      "type": "default"
    }
  ],
  "edges": [
    {
      "from": "unique_id",
      "to": "another_unique_id",
      "label": "Optional connection label"
    }
  ],
  "chart": {
    "labels": ["Category A", "Category B"],
    "series": [
      {
        "name": "Series name",
        "values": [10, 20]
      }
    ],
    "unit": "Optional unit",
    "dataOrigin": "illustrative"
  }
}

Rules:
- Use only the requested visual type: ${visualType}.
- For diagrams, flowcharts, mind maps and infographics, provide nodes and edges.
- For charts and graphs, provide chart data.
- Do not invent real-world statistics, research findings, citations or sources.
- Never invent numerical chart values unless the user explicitly requests sample, illustrative, hypothetical or demonstration data.
- When the user supplies numerical data, preserve those values accurately and classify the origin as user-provided.
- When the user explicitly requests sample data, classify the origin as illustrative and clearly disclose this in the explanation.
- Never describe illustrative data as actual research or verified facts.
- Keep labels concise and explanations informative.
- Do not include HTML, scripts, executable code or external image URLs.
- Do not include fields that are not needed.
- Keep the visual understandable and relevant to the user's request.

User request:
${userPrompt}
`

  const result = await runHybridInference(
    instruction,
    mode,
    cloudConsent,
  )

  const payload = validatePayload(extractJson(result.text), visualType, userPrompt)

  return {
    ...payload,
    inferenceSource:
      result.source === InferenceSource.ON_DEVICE ? 'on_device' : 'in_cloud',
    warnings:
      payload.chart?.dataOrigin === 'illustrative'
        ? ['Chart values are illustrative, not verified real-world data.']
        : [],
  }
}
