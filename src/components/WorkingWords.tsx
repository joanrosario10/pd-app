import { useQueryClient } from '@tanstack/react-query'
import { useQuote } from '../hooks/useQuote'

export default function WorkingWords() {
  const queryClient = useQueryClient()
  const { data: quote, isLoading, isError } = useQuote()

  if (isLoading) {
    return (
      <div className="page-card">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Working words</h2>
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    )
  }

  if (isError || !quote) {
    return (
      <div className="page-card">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Working words</h2>
        <p className="text-sm text-gray-600 italic">
          &ldquo;Small steps every day lead to lasting change. You&apos;re doing great by staying on track with your medications.&rdquo;
        </p>
        <p className="text-xs text-gray-500 mt-2">— Your care team</p>
      </div>
    )
  }

  return (
    <div className="page-card">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">Working words</h2>
      <p className="text-sm text-gray-600 italic">&ldquo;{quote.content}&rdquo;</p>
      <p className="text-xs text-gray-500 mt-2">— {quote.author}</p>
      <button
        type="button"
        onClick={() => queryClient.invalidateQueries({ queryKey: ['quote'] })}
        className="mt-3 text-xs text-primary-600 hover:underline"
      >
        Another quote
      </button>
    </div>
  )
}
