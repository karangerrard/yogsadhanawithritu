import { useEffect, useRef } from 'react'

/**
 * useScrollReveal — attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, adds the CSS class `animate-in`.
 * Works for any element without needing an animation library.
 *
 * Usage:
 *   const ref = useScrollReveal()
 *   return <div ref={ref} className="my-element">...</div>
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15
): React.RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-in')
          observer.unobserve(el) // fire once
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
