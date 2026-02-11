import { useCalendarLogs } from '../hooks/useMedications'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function MedicationCalendar({
  year,
  month,
  onMonthChange,
}: {
  year: number
  month: number
  onMonthChange: (y: number, m: number) => void
}) {
  const { takenDates } = useCalendarLogs(year, month)
  const today = new Date().toISOString().slice(0, 10)
  const first = new Date(year, month - 1, 1)
  const last = new Date(year, month, 0)
  const startPad = first.getDay()
  const daysInMonth = last.getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const prev = () => {
    if (month === 1) onMonthChange(year - 1, 12)
    else onMonthChange(year, month - 1)
  }
  const next = () => {
    if (month === 12) onMonthChange(year + 1, 1)
    else onMonthChange(year, month + 1)
  }

  return (
    <div className="page-card min-w-0 overflow-hidden">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">Medication Calendar</h2>
      <div className="flex items-center justify-between mb-3 min-w-0">
        <button
          type="button"
          onClick={prev}
          className="p-1 rounded hover:bg-gray-100 text-gray-600"
          aria-label="Previous month"
        >
          ←
        </button>
        <span className="text-sm font-medium text-gray-800">
          {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button
          type="button"
          onClick={next}
          className="p-1 rounded hover:bg-gray-100 text-gray-600"
          aria-label="Next month"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs mb-2">
        {DAYS.map((d) => (
          <div key={d} className="font-medium text-gray-500 py-1">
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={`e-${i}`} />
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const isToday = dateStr === today
          const taken = takenDates.has(dateStr)
          return (
            <div key={d} className="py-1 flex flex-col items-center gap-0.5">
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs ${
                  isToday ? 'bg-primary-600 text-white' : 'text-gray-800'
                }`}
              >
                {d}
              </span>
              {!isToday && taken && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
              {!isToday && !taken && new Date(dateStr) < new Date(today) && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              )}
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mt-2 pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" /> Taken
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400" /> Missed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary-600" /> Today
        </span>
      </div>
    </div>
  )
}

export { getGreeting }
