import type { ReactNode } from 'react'

type PageBannerProps = {
  title: string
  subtitle: string
  icon?: ReactNode
  stats?: ReactNode
}

export default function PageBanner({ title, subtitle, icon, stats }: PageBannerProps) {
  return (
    <div className="rounded-xl bg-gradient-to-r from-primary-600 to-green-500 p-4 sm:p-5 text-white min-w-0">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          {icon ?? (
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold truncate">{title}</h1>
          <p className="text-white/90 text-xs sm:text-sm mt-0.5">{subtitle}</p>
        </div>
      </div>
      {stats && <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">{stats}</div>}
    </div>
  )
}
