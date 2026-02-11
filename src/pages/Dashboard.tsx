import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMedicationsToday } from '../hooks/useMedications'
import MedicationCalendar, { getGreeting } from '../components/MedicationCalendar'
import PageBanner from '../components/PageBanner'

const emptyState = (
  <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
    <p className="text-gray-600 text-sm">No medications added yet.</p>
    <Link
      to="/medications"
      className="mt-3 inline-block py-2 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 no-underline"
    >
      Add medication
    </Link>
  </div>
)

export default function Dashboard() {
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth() + 1)
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear())
  const {
    medicationsToday,
    isLoading,
    isError,
    error,
    markTaken,
    markLoadingId,
    markTakenError,
  } = useMedicationsToday()
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
  const takenCount = medicationsToday.filter((m) => m.taken_today).length
  const total = medicationsToday.length

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 min-w-0">
        <div className="flex-1 min-w-0 space-y-4">
          <div className="h-28 sm:h-32 rounded-xl bg-gray-200 animate-pulse" />
          <div className="h-48 rounded-xl bg-gray-100 animate-pulse" />
        </div>
        <div className="w-full lg:w-72 shrink-0 h-64 lg:h-80 rounded-xl bg-gray-100 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 min-w-0">
      {/* Left column */}
      <div className="flex-1 min-w-0 space-y-4">
        <PageBanner
          title={`${getGreeting()}!`}
          subtitle="Ready to stay on track with your medication?"
          stats={
            <>
              <div className="flex-1 min-w-[80px] rounded-lg bg-white/20 px-2 sm:px-3 py-2 sm:py-2.5 text-center">
                <p className="text-xl sm:text-2xl font-bold">{takenCount}</p>
                <p className="text-xs text-white/90">Taken today</p>
              </div>
              <div className="flex-1 min-w-[80px] rounded-lg bg-white/20 px-2 sm:px-3 py-2 sm:py-2.5 text-center">
                <p className="text-xl sm:text-2xl font-bold">{total}</p>
                <p className="text-xs text-white/90">Total today</p>
              </div>
              <div className="flex-1 min-w-[80px] rounded-lg bg-white/20 px-2 sm:px-3 py-2 sm:py-2.5 text-center">
                <p className="text-xl sm:text-2xl font-bold">
                  {total > 0 ? Math.round((takenCount / total) * 100) : 0}%
                </p>
                <p className="text-xs text-white/90">Today&apos;s status</p>
              </div>
            </>
          }
        />

        {/* Today's Medication */}
        <div className="page-card">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>Today&apos;s Medication</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 font-normal text-xs">{today}</span>
          </h2>

          {isError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
              <p className="font-medium">Couldn&apos;t load medications</p>
              <p className="mt-1 font-mono text-xs">{error instanceof Error ? error.message : String(error)}</p>
            </div>
          )}

          {markTakenError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
              <p className="font-medium">Couldn&apos;t mark as taken</p>
              <p className="mt-1 text-xs">
                {markTakenError instanceof Error ? markTakenError.message : String(markTakenError)}
              </p>
            </div>
          )}

          {total === 0 ? (
            emptyState
          ) : (
            <ul className="space-y-2">
              {medicationsToday.map((med, idx) => (
                <li
                  key={med.id}
                  className={`rounded-lg border p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0 ${
                    med.taken_today ? 'border-green-200 bg-green-50/50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                        med.taken_today ? 'bg-green-200 text-green-800' : 'bg-primary-100 text-primary-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{med.name}</p>
                      <p className="text-xs text-gray-500 truncate">{med.dosage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    {med.taken_today ? (
                      <span className="text-sm font-medium text-green-700">Taken</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markTaken(med.id)}
                        disabled={markLoadingId !== null}
                        className="py-2 px-3 sm:px-4 rounded-lg bg-green-600 text-white text-xs sm:text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {markLoadingId === med.id ? 'Saving…' : 'Mark as taken'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {total > 0 && (
            <p className="mt-4 text-center">
              <Link to="/medications" className="text-sm text-primary-600 hover:underline">
                Add or manage medications
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Right column - Calendar */}
      <div className="w-full lg:w-80 shrink-0 min-w-0">
        <MedicationCalendar
          year={calendarYear}
          month={calendarMonth}
          onMonthChange={(y, m) => {
            setCalendarYear(y)
            setCalendarMonth(m)
          }}
        />
      </div>
    </div>
  )
}
