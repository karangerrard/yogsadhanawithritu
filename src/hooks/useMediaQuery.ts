import { useState, useEffect } from 'react'

/**
 * useMediaQuery — returns true when the CSS media query matches.
 * Reactive: updates automatically on window resize.
 *
 * Usage:
 *   const isMobile = useMediaQuery('(max-width: 768px)')
 *   const isDesktop = useMediaQuery('(min-width: 1024px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent): void => setMatches(e.matches)

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}
