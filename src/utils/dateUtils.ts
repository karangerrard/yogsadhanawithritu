/**
 * relativeDate(baseDate)
 * 
 * Given a past date, returns a human-readable relative string
 * that automatically updates every day — no manual editing needed.
 * 
 * Usage:
 *   relativeDate('2025-04-20')  → "15 days ago" today, "16 days ago" tomorrow
 */
export function relativeDate(baseDate: string): string {
  const diffMs = Date.now() - new Date(baseDate).getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7)  return `${days} days ago`
  if (days < 14) return '1 week ago'
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 60) return '1 month ago'
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  if (days < 730) return '1 year ago'
  return `${Math.floor(days / 365)} years ago`
}