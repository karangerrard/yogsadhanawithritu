import { useState, useEffect, useCallback } from 'react'
import {
  GOOGLE_PLACE_ID,
  GOOGLE_API_KEY,
  FALLBACK_REVIEWS,
  sectionMeta,
} from './testimonials.config'
import type { GoogleReview } from './testimonials.config'
import { useScrollReveal } from '@hooks/useScrollReveal'
import { useMediaQuery } from '@hooks/useMediaQuery'
import styles from './TestimonialsSection.module.css'

// ── Helpers ───────────────────────────────────────────────────────────────────

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }): JSX.Element {
  return (
    <span className={size === 'sm' ? styles.starsSmall : styles.starsMd} aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

function GoogleIcon({ size = 16 }: { size?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

// ── Google Places API fetch ───────────────────────────────────────────────────
// When GOOGLE_PLACE_ID and GOOGLE_API_KEY are set in .env, this fetches
// live reviews and maps them to the GoogleReview shape.
// Returns null if credentials are missing — component falls back to FALLBACK_REVIEWS.

async function fetchGoogleReviews(): Promise<GoogleReview[] | null> {
  const isConfigured =
    GOOGLE_PLACE_ID !== 'YOUR_GOOGLE_PLACE_ID_HERE' && GOOGLE_API_KEY !== ''

  if (!isConfigured) return null

  try {
    // NOTE: In production, proxy this through your own backend to keep the API key private.
    // Direct browser calls to the Places API expose your key in client-side code.
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${GOOGLE_PLACE_ID}` +
      `&fields=reviews,rating,user_ratings_total` +
      `&key=${GOOGLE_API_KEY}`

    const res = await fetch(url)
    if (!res.ok) return null

    const data = await res.json() as {
      result?: {
        reviews?: Array<{
          author_name: string
          rating: number
          relative_time_description: string
          text: string
        }>
      }
    }

    const raw = data?.result?.reviews
    if (!raw || raw.length === 0) return null

    // Map Google API shape → our GoogleReview shape (max 5)
    return raw.slice(0, 5).map(r => ({
      initials: r.author_name
        .split(' ')
        .slice(0, 2)
        .map(w => w[0]?.toUpperCase() ?? '')
        .join(''),
      name: r.author_name,
      rating: r.rating,
      date: r.relative_time_description,
      text: r.text,
    }))
  } catch {
    return null
  }
}

// ── Review card (no box — open layout) ───────────────────────────────────────

function ReviewBlock({ review }: { review: GoogleReview }): JSX.Element {
  return (
    <div className={styles.reviewBlock}>
      <span className={styles.qGlyph} aria-hidden="true">"</span>
      <p className={styles.reviewText}>{review.text}</p>
      <div className={styles.reviewFooter}>
        <div className={styles.avatar} aria-hidden="true">
          {review.avatar
            ? <img src={review.avatar} alt={review.name} className={styles.avatarImg} />
            : review.initials
          }
        </div>
        <div className={styles.reviewerInfo}>
          <p className={styles.reviewerName}>{review.name}</p>
          <div className={styles.reviewMeta}>
            <StarRating rating={review.rating} size="sm" />
            <span className={styles.reviewDate}>· {review.date}</span>
          </div>
        </div>
        <GoogleIcon size={16} />
      </div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export function TestimonialsSection(): JSX.Element {
  const [reviews, setReviews] = useState<GoogleReview[]>(FALLBACK_REVIEWS)
  const [page, setPage] = useState(0)
  const isMobile = useMediaQuery('(max-width: 580px)')
  const perPage = isMobile ? 1 : 2
  const totalPages = Math.ceil(reviews.length / perPage)
  const headerRef = useScrollReveal<HTMLDivElement>()

  // Attempt live Google fetch on mount — silently falls back if not configured
  useEffect(() => {
    fetchGoogleReviews().then(live => {
      if (live && live.length > 0) setReviews(live)
    })
  }, [])

  // Reset to page 0 when perPage changes (screen resize / orientation change)
  useEffect(() => {
    setPage(p => Math.min(p, Math.max(0, totalPages - 1)))
  }, [perPage, totalPages])

  const goTo = useCallback((n: number): void => {
    setPage(Math.max(0, Math.min(n, totalPages - 1)))
  }, [totalPages])

  const currentSlice = reviews.slice(page * perPage, page * perPage + perPage)

  return (
    <section className={`section ${styles.testimonials}`} id="testimonials">
      <div className="container">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className={styles.header} ref={headerRef}>
          <div className={styles.googleBadge}>
            <GoogleIcon size={18} />
            <span className={styles.badgeLabel}>{sectionMeta.label}</span>
          </div>

          <h2 className={styles.heading}>{sectionMeta.heading}</h2>

          <div className={styles.overallRating}>
            <span className={styles.ratingNum}>{sectionMeta.overallRating}</span>
            <StarRating rating={5} size="md" />
            <span className={styles.ratingCount}>({sectionMeta.totalReviews} reviews)</span>
          </div>
        </div>

        {/* ── Ornament divider ────────────────────────────────────────────── */}
        <div className={styles.ornament} aria-hidden="true">
          <span className={styles.ornLine} />
          <svg className={styles.ornLeaf} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 1-11 5 0 0-1 2 0 5 0 0-3-1-3-5 0-6 7-9 9-9z" />
          </svg>
          <span className={styles.ornLine} />
        </div>

        {/* ── Review grid — 2 col desktop / 1 col mobile ─────────────────── */}
        <div className={styles.grid}>
          {currentSlice.map((review, i) => (
            <ReviewBlock key={`${page}-${i}`} review={review} />
          ))}
          {/* Ghost cell to keep grid balanced when only 1 review on last page (desktop) */}
          {!isMobile && currentSlice.length === 1 && (
            <div className={styles.ghostCell} aria-hidden="true" />
          )}
        </div>

        {/* ── Pagination ──────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className={styles.navRow}>
            <button
              className={styles.navBtn}
              onClick={() => goTo(page - 1)}
              disabled={page === 0}
              aria-label="Previous reviews"
            >
              ←
            </button>

            <div className={styles.dots} role="tablist" aria-label="Review pages">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === page ? styles.dotActive : ''}`}
                  onClick={() => goTo(i)}
                  role="tab"
                  aria-selected={i === page}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>

            <span className={styles.pageInfo} aria-live="polite">
              {page + 1} of {totalPages}
            </span>

            <button
              className={styles.navBtn}
              onClick={() => goTo(page + 1)}
              disabled={page >= totalPages - 1}
              aria-label="Next reviews"
            >
              →
            </button>
          </div>
        )}

      </div>
    </section>
  )
}
