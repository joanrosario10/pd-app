import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useAdherenceProgress } from '../hooks/useMedications'

const COLORS = ['#1a73e8', '#34a853', '#f9ab00', '#ea4335']

export default function ProgressChart() {
  const { weekly, isLoading } = useAdherenceProgress()

  if (isLoading || weekly.length === 0) {
    return (
      <div className="page-card">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Progress & recovery</h2>
        <p className="text-sm text-gray-500">Add medications and mark them as taken to see your adherence progress here.</p>
      </div>
    )
  }

  return (
    <div className="page-card">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">Progress & recovery</h2>
      <p className="text-xs text-gray-500 mb-4">
        Weekly adherence: days you took at least one medication. Staying consistent supports your recovery.
      </p>
      <div className="h-48 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekly} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#6b7280" tickFormatter={(v) => `${v}%`} />
            <Tooltip
              formatter={(value: number | undefined) => [`${value ?? 0}%`, 'Adherence']}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
              labelFormatter={(label) => `Week ${label.replace('W', '')}`}
            />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {weekly.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Last 4 weeks. Aim for 100% to build a strong routine.
      </p>
    </div>
  )
}
