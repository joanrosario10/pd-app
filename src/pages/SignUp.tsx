import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../lib/supabase'

const envHelp = (
  <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
    <p className="font-medium mb-1">Supabase not configured</p>
    <p className="mb-2">
      Add <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
      <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to a{' '}
      <code className="bg-amber-100 px-1 rounded">.env</code> file (copy from{' '}
      <code className="bg-amber-100 px-1 rounded">.env.example</code>). Then <strong>restart the dev server</strong> (Ctrl+C, then <code className="bg-amber-100 px-1 rounded">npm run start</code>).
    </p>
  </div>
)

const schema = z
  .object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function SignUp() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setError(null)
    if (!supabase) {
      setError('Supabase is not configured. See instructions above.')
      return
    }
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })
    if (signUpError) {
      setError(signUpError.message)
      return
    }
    setSuccess(true)
    // If session exists (e.g. email confirmation disabled), go to dashboard
    if (signUpData?.session) {
      window.location.href = '/'
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-surface">
        <div className="w-full max-w-sm text-center">
          <p className="text-gray-700">Check your email to confirm your account.</p>
          <Link to="/login" className="mt-4 inline-block text-primary-600 font-medium hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-6 bg-surface min-w-0 overflow-x-hidden">
      <div className="w-full max-w-sm min-w-0">
        {!supabase && envHelp}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
            <span className="font-brand text-2xl font-semibold italic text-gray-900">Soignant</span>
          </div>
          <h1 className="text-2xl font-medium text-gray-900">Create your account</h1>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
        >
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full py-2.5 px-4 rounded-lg bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
