import { useState, useEffect, useCallback } from 'react'

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

export interface UseApiState<T> {
  data: T | null
  status: FetchStatus
  error: string | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  refetch: () => void
}

/**
 * Generic hook for async API calls.
 * Handles loading, success, and error states.
 *
 * @example
 * const { data, isLoading, isError, refetch } = useApi(fetchTransactions)
 */
export function useApi<T>(
  fetcher: () => Promise<{ data: T }>,
  deps: unknown[] = [],
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<FetchStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const res = await fetcher()
      setData(res.data)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    run()
  }, [run])

  return {
    data,
    status,
    error,
    isLoading: status === 'loading' || status === 'idle',
    isError: status === 'error',
    isSuccess: status === 'success',
    refetch: run,
  }
}
