import { useCallback } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Layout() {
  const { signOut } = useAuth()
  const location = useLocation()

  const linkClass = useCallback((path: string) =>
    `text-xs sm:text-sm no-underline py-2 sm:py-0 px-2 rounded hover:bg-gray-100 ${
      location.pathname === path ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'
    }`,
  [location.pathname])

  return (
    <div className="min-h-screen bg-surface min-w-0">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 h-12 sm:h-14 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 text-gray-800 no-underline shrink-0 min-w-0">
            <img src="/logo.png" alt="Logo" className="h-7 sm:h-8 w-auto" />
            <span className="font-brand text-lg sm:text-xl font-semibold italic text-gray-800">Soignant</span>
          </Link>
          <nav className="flex items-center flex-wrap justify-end gap-1 sm:gap-4 min-w-0">
            <Link to="/" className={linkClass('/')}>
              Today
            </Link>
            <Link to="/medications" className={linkClass('/medications')}>
              Medications
            </Link>
            <Link to="/profile" className={linkClass('/profile')}>
              Profile
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 py-2 sm:py-1 px-2 rounded hover:bg-gray-100 whitespace-nowrap"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
