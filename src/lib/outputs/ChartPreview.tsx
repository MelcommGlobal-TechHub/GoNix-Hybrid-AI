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
import type { VisualResult } from './types'

interface ChartPreviewProps {
  visual: VisualResult
}

export default function ChartPreview({ visual }: ChartPreviewProps) {
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
