import { useQuery } from '@tanstack/react-query'

const QUOTABLE_API = 'https://api.quotable.io/random'

export type Quote = {
  content: string
  author: string
}

async function fetchQuote(): Promise<Quote> {
  const res = await fetch(`${QUOTABLE_API}?tags=inspirational|motivational|life|health`)
  if (!res.ok) throw new Error('Failed to fetch quote')
  const data = await res.json()
  return { content: data.content ?? '', author: data.author ?? 'Unknown' }
}

export function useQuote(enabled = true) {
  return useQuery({
    queryKey: ['quote'],
    queryFn: fetchQuote,
    enabled,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  })
}
