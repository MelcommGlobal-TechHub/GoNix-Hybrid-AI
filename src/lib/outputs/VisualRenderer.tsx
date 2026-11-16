import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { VisualResult, VisualNode } from './types'

interface VisualRendererProps {
  visual: VisualResult
}

function DiagramPreview({ visual }: VisualRendererProps) {
  const nodes = visual.nodes ?? []
  const edges = visual.edges ?? []
  const isFlowchart = visual.type === 'flowchart'

  if (nodes.length === 0) {
    return <div className="visual-error">This visual has no diagram nodes to display.</div>
  }

  return (
    <div className={`diagram-preview ${isFlowchart ? 'diagram-flowchart' : 'diagram-horizontal'}`}>
      <div className="diagram-node-list">
        {nodes.map((node, index) => {
          const outgoing = edges.filter((edge) => edge.from === node.id)

          return (
            <React.Fragment key={node.id}>
              <article className={`diagram-node diagram-node-${node.type ?? 'default'}`}>
                <span className="diagram-node-number">{String(index + 1).padStart(2, '0')}</span>
                <strong>{node.label}</strong>
                {node.description && <p>{node.description}</p>}
              </article>

              {outgoing.map((edge, edgeIndex) => (
                <div className="diagram-connection" key={`${node.id}-${edge.to}-${edgeIndex}`}>
                  <span className="diagram-arrow" aria-hidden="true">
                    {isFlowchart ? '↓' : '→'}
                  </span>
                  {edge.label && <span className="diagram-edge-label">{edge.label}</span>}
                  <span className="diagram-edge-target">
                    {nodes.find((target) => target.id === edge.to)?.label ?? 'Next'}
                  </span>
                </div>
              ))}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

function InfographicPreview({ visual }: VisualRendererProps) {
  const nodes = visual.nodes ?? []

  return (
    <div className="infographic-preview">
      <div className="infographic-grid">
        {nodes.map((node, index) => (
          <article className="infographic-card" key={node.id}>
            <span className="infographic-number">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h4>{node.label}</h4>
            {node.description && <p>{node.description}</p>}
            {node.type && node.type !== 'default' && (
              <span className="infographic-tag">{node.type}</span>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

function MindMapPreview({ visual }: VisualRendererProps) {
  const nodes = visual.nodes ?? []
  const edges = visual.edges ?? []
  const root = nodes[0]

  if (!root) {
    return <div className="visual-error">No mind map topics were provided.</div>
  }

  const childIds = new Set(edges.map((edge) => edge.to))

  const branches = nodes.filter(
    (node) => node.id !== root.id && childIds.has(node.id),
  )

  const remaining = nodes.filter(
    (node) => node.id !== root.id && !childIds.has(node.id),
  )

  const displayedBranches = branches.length > 0 ? branches : remaining

  return (
    <div className="mindmap-preview">
      <div className="mindmap-root">{root.label}</div>
      <div className="mindmap-branches">
        {displayedBranches.map((node) => {
          const children = edges
            .filter((edge) => edge.from === node.id)
            .map((edge) => ({
              node: nodes.find((item) => item.id === edge.to),
              label: edge.label,
            }))
            .filter(
              (item): item is { node: VisualNode; label: string } =>
                Boolean(item.node),
            )

          return (
            <section className="mindmap-branch" key={node.id}>
              <div className="mindmap-topic">{node.label}</div>
              {node.description && <p>{node.description}</p>}
              {children.length > 0 && (
                <ul>
                  {children.map((child) => (
                    <li key={child.node.id}>
                      {child.node.label}
                      {child.label && (
                        <span className="mindmap-edge-label">
                          {' '}· {child.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}


function ChartPreview({ visual }: VisualRendererProps) {
  const chart = visual.chart

  if (!chart) {
    return <div className="visual-error">No valid chart data was provided.</div>
  }

  const data = chart.labels.map((label, index) => {
    const point: Record<string, string | number> = { label }

    chart.series.forEach((series, seriesIndex) => {
      point[`series${seriesIndex}`] = series.values[index]
    })

    return point
  })

  const isLine = visual.type === 'graph'

  return (
    <div className="chart-preview">
      <ResponsiveContainer width="100%" height={320}>
        {isLine ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="label" stroke="#a1a1aa" />
            <YAxis stroke="#a1a1aa" />
            <Tooltip />
            <Legend />
            {chart.series.map((series, index) => (
              <Line
                key={series.name}
                type="monotone"
                dataKey={`series${index}`}
                name={series.name}
                stroke={['#60a5fa', '#a78bfa', '#34d399', '#fbbf24'][index % 4]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="label" stroke="#a1a1aa" />
            <YAxis stroke="#a1a1aa" />
            <Tooltip />
            <Legend />
            {chart.series.map((series, index) => (
              <Bar
                key={series.name}
                dataKey={`series${index}`}
                name={series.name}
                fill={['#60a5fa', '#a78bfa', '#34d399', '#fbbf24'][index % 4]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
      {chart.unit && <p className="chart-unit">Unit: {chart.unit}</p>}
      <p className="chart-origin">
        Data origin: {chart.dataOrigin === 'illustrative' ? 'Illustrative example' : 'User-provided data'}
      </p>
    </div>
  )
}

export default function VisualRenderer({ visual }: VisualRendererProps) {
  let preview

  if (visual.type === 'chart' || visual.type === 'graph') {
    preview = <ChartPreview visual={visual} />
  } else if (visual.type === 'infographic') {
    preview = <InfographicPreview visual={visual} />
  } else if (visual.type === 'mindmap') {
    preview = <MindMapPreview visual={visual} />
  } else {
    preview = <DiagramPreview visual={visual} />
  }

  return (
    <section className="visual-result">
      <div className="visual-heading">
        <span className="subtle-label">VISUAL RESULT</span>
        <h3>{visual.title}</h3>
        <p>{visual.explanation}</p>
      </div>

      {preview}

      {visual.warnings.length > 0 && (
        <div className="visual-warning">
          {visual.warnings.map((warning, index) => (
            <p key={index}>{warning}</p>
          ))}
        </div>
      )}
    </section>
  )
}
