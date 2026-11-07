import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ObjectiveStat } from '../../types'
import { useI18n } from '../../i18n'

interface ObjectiveChartProps {
  objectives: ObjectiveStat[]
}

function shortLabel(text: string): string {
  return text.length > 34 ? `${text.slice(0, 31)}…` : text
}

export function ObjectiveChart({ objectives }: ObjectiveChartProps) {
  const { t } = useI18n()
  const data = objectives.map((objective) => ({
    name: objective.text,
    label: shortLabel(objective.text),
    accuracy: objective.accuracy,
    fill:
      objective.accuracy < 60
        ? '#fb7185'
        : objective.accuracy < 80
          ? '#f5c451'
          : '#34d399',
  }))
  const height = Math.max(230, data.length * 54)

  return (
    <div
      className="w-full"
      style={{ height }}
      role="img"
      aria-label={t('a11y.chart')}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 18, bottom: 4, left: 4 }}
          barCategoryGap="28%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#232d55"
            horizontal={false}
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: '#6b779f', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: '#232d55' }}
            tickFormatter={(value) => `${String(value)}%`}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={170}
            tick={{ fill: '#9aa6d4', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.035)' }}
            contentStyle={{
              background: '#0a1029',
              border: '1px solid #232d55',
              borderRadius: 12,
              fontSize: 12,
              color: '#e2e8f0',
            }}
            labelStyle={{ color: '#ffffff', fontWeight: 600 }}
            formatter={(value) => [
              `${String(value)}%`,
              t('dashboard.chartAccuracy'),
            ]}
            labelFormatter={(label) => {
              const match = data.find((entry) => entry.label === String(label))
              return match?.name ?? String(label)
            }}
          />
          <ReferenceLine x={60} stroke="#fb7185" strokeDasharray="4 4" strokeOpacity={0.5} />
          <Bar dataKey="accuracy" radius={[0, 6, 6, 0]} barSize={14}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
