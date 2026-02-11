import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../lib/auth'
import PageBanner from '../components/PageBanner'
import ProgressChart from '../components/ProgressChart'
import WorkingWords from '../components/WorkingWords'
import { FormFieldInput } from '../components/ui/FormField'

const schema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function Profile() {
  const { user } = useAuth()
  const { profile, isLoading, updateProfile, updateLoading, updateError } = useProfile()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: profile
      ? { full_name: profile.full_name ?? '', phone: profile.phone ?? '' }
      : undefined,
  })

  async function onSubmit(data: FormData) {
    await updateProfile({
      full_name: data.full_name || null,
      phone: data.phone || null,
    })
  }

  if (isLoading || !profile) {
    return (
      <div className="space-y-4 min-w-0">
        <PageBanner
          title="Profile"
          subtitle="Edit your name and phone number."
          icon={
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          }
        />
        <div className="page-card">
          <p className="text-gray-500 text-sm">Loading profile…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 min-w-0">
      <PageBanner
        title="Profile"
        subtitle="Edit your name and phone number."
        icon={
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-w-0">
        <div className="page-card max-w-md lg:max-w-none lg:min-w-[280px] lg:flex-1">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>Account details</span>
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {updateError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {updateError instanceof Error ? updateError.message : String(updateError)}
            </div>
          )}

        <FormFieldInput
          label="Email"
          id="email"
          hint="Email is managed by your account and cannot be changed here."
          inputProps={{
            type: 'email',
            value: user?.email ?? profile.email ?? '',
            readOnly: true,
          }}
        />
        <FormFieldInput
          label="Full name"
          id="full_name"
          error={errors.full_name?.message}
          inputProps={{
            ...register('full_name'),
            placeholder: 'Your name',
          }}
        />
        <FormFieldInput
          label="Phone"
          id="phone"
          error={errors.phone?.message}
          inputProps={{
            ...register('phone'),
            type: 'tel',
            placeholder: 'e.g. +1 234 567 8900',
          }}
        />

          <button
            type="submit"
            disabled={updateLoading}
            className="py-2.5 px-4 rounded-lg bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60"
          >
            {updateLoading ? 'Saving…' : 'Save changes'}
          </button>
          </form>
        </div>

        <div className="lg:flex-1 lg:min-w-0">
          <ProgressChart />
        </div>
      </div>

      <WorkingWords />
    </div>
  )
}
