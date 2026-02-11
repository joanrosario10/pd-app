import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMedications } from '../hooks/useMedications'
import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'

const addSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().optional(),
  notes: z.string().optional(),
})

type AddFormData = z.infer<typeof addSchema>

export default function Medications() {
  const [addOpen, setAddOpen] = useState(false)
  const {
    medications,
    isLoading,
    addMedication,
    addLoading,
    deleteMedication,
    deleteLoading,
  } = useMedications()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddFormData>({ resolver: zodResolver(addSchema) })

  async function onSubmit(data: AddFormData) {
    await addMedication({
      name: data.name,
      dosage: data.dosage,
      frequency: data.frequency || null,
      notes: data.notes || null,
    })
    reset()
    setAddOpen(false)
  }

  return (
    <div className="space-y-4 min-w-0">
      <PageBanner
        title="Medications"
        subtitle="Add and manage your medications. Mark them as taken on the Today page."
        icon={
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM15 20H6v-3h9v3zm4-5H5V5h14v10z" />
          </svg>
        }
        stats={
          <div className="flex-1 min-w-[80px] rounded-lg bg-white/20 px-2 sm:px-3 py-2 sm:py-2.5 text-center">
            <p className="text-xl sm:text-2xl font-bold">{medications.length}</p>
            <p className="text-xs text-white/90">Total medications</p>
          </div>
        }
      />

      {/* Add medication accordion */}
      <div className="page-card border-2 border-dashed border-gray-300 bg-gray-50/50">
        <button
          type="button"
          onClick={() => setAddOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-2 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded-lg -m-1 p-1"
          aria-expanded={addOpen}
        >
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Add medication</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter name and dosage to add a new medication to your list.
            </p>
          </div>
          <span
            className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 transition-transform duration-200 ${
              addOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        {addOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 pt-4 border-t border-gray-200">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g. Aspirin"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
              Dosage
            </label>
            <input
              id="dosage"
              {...register('dosage')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g. 100mg once daily"
            />
            {errors.dosage && (
              <p className="mt-1 text-sm text-red-600">{errors.dosage.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
              Frequency (optional)
            </label>
            <input
              id="frequency"
              {...register('frequency')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g. Once daily, Every 8 hours"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              rows={2}
              {...register('notes')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Any notes about this medication"
            />
          </div>
          <button
            type="submit"
            disabled={addLoading}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60"
          >
            {addLoading ? 'Adding…' : 'Add medication'}
          </button>
        </form>
        )}
      </div>

      <div className="page-card">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>Your medications</span>
        </h2>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : medications.length === 0 ? (
          <p className="text-sm text-gray-500">No medications yet. Add one above.</p>
        ) : (
          <ul className="space-y-2">
            {medications.map((med) => (
              <li
                key={med.id}
                className="rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 min-w-0"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{med.name}</p>
                  <p className="text-sm text-gray-500 truncate">{med.dosage}</p>
                  {(med.frequency || med.notes) && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 sm:line-clamp-1">
                      {[med.frequency, med.notes].filter(Boolean).join(' • ')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <Link to="/" className="text-sm text-primary-600 hover:underline">
                    Mark taken today
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteMedication(med.id)}
                    disabled={deleteLoading}
                    className="text-sm text-red-600 hover:underline disabled:opacity-60"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
