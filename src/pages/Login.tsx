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
      <code className="bg-amber-100 px-1 rounded">.env</code> file in the project root (copy from{' '}
      <code className="bg-amber-100 px-1 rounded">.env.example</code>). Then <strong>restart the dev server</strong>:
      stop it (Ctrl+C) and run <code className="bg-amber-100 px-1 rounded">npm run start</code> again.
    </p>
  </div>
)

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const [error, setError] = useState<string | null>(null)
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
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (signInError) {
      if (signInError.message === 'Email not confirmed') {
        setError(
          'Please confirm your email first. Check your inbox (and spam) for a confirmation link from Supabase. If you run this project, you can turn off "Confirm email" in Supabase Dashboard → Authentication → Providers → Email.'
        )
      } else {
        setError(signInError.message)
      }
      return
    }
    // Reload so auth state is fresh and ProtectedRoute sees the user
    window.location.href = '/'
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
          <h1 className="text-2xl font-medium text-gray-900">Sign in</h1>
          <p className="text-gray-600 mt-1 text-sm">Sign in to continue</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
        >
          {error && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                error.includes('confirm your email')
                  ? 'bg-amber-50 border border-amber-200 text-amber-900'
                  : 'bg-red-50 text-red-700'
              }`}
            >
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
                autoComplete="current-password"
                {...register('password')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full py-2.5 px-4 rounded-lg bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-primary-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
