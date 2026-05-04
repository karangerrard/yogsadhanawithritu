/**
 * ─── GOOGLE REVIEWS CONFIG ────────────────────────────────────────────────────
 *
 * 🔑 TO CONNECT YOUR REAL GOOGLE REVIEWS:
 *
 *  1. Go to https://console.cloud.google.com and enable the "Places API"
 *  2. Find your Place ID at:
 *     https://developers.google.com/maps/documentation/places/web-service/place-id
 *     It looks like: ChIJN1t_tDeuEmsRUsoyG83frY4
 *  3. Add to your .env file:
 *     VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
 *  4. Replace 'YOUR_GOOGLE_PLACE_ID_HERE' below with your actual Place ID
 *
 *  Until connected, FALLBACK_REVIEWS are shown automatically.
 *  Google Places API (free tier) returns a maximum of 5 reviews per place.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import nandiniImg  from '@assets/images/reviews/nandini.png'
import swatiImg  from '@assets/images/reviews/swati.png'
import hemantImg  from '@assets/images/reviews/hemant.png'
import karanImg  from '@assets/images/reviews/karan.png'
import { relativeDate } from '@utils/dateUtils'

// ── Step 1: Replace this with your Google Business Place ID ─────────────────
export const GOOGLE_PLACE_ID = 'YOUR_GOOGLE_PLACE_ID_HERE'

// ── Step 2: Set VITE_GOOGLE_MAPS_API_KEY in your .env file ──────────────────
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''

// ── Section header copy ──────────────────────────────────────────────────────
export const sectionMeta = {
  label: 'Google Reviews',
  heading: 'Words from the community',
  overallRating: 5,
  totalReviews: 9,
}

// ── Review shape ─────────────────────────────────────────────────────────────
export interface GoogleReview {
  initials: string   // Used as avatar until Google profile photo loads
  name: string
  rating: number     // 1–5
  date: string
  text: string
  avatar?: string     // Google profile photo URL (optional, can be generated from initials if not provided)
}

/**
 * Fallback reviews — displayed when Google Places API is not yet wired up.
 * Max 5 entries (mirrors the Google Places API free-tier limit).
 * Remove/replace these once your live Place ID is connected.
 */
export const FALLBACK_REVIEWS: GoogleReview[] = [
  {
    initials: 'NC',
    name: 'Nandini Chandrashekar',
    avatar: nandiniImg,
    rating: 5,
    date: relativeDate('2026-05-03'),
    text: 'Ritu ji teaches us the most authentic form of yoga, I thought yoga was just asana practice, but she taught me bhakti and introduced me to sound healing to overcome the past trauma and her classes are designed beautifully.Thank you Ritu ji for being a guide to my sadhana',
  },
  {
    initials: 'S',
    name: 'Swati',
    avatar: swatiImg,
    rating: 5,
    date: relativeDate('2026-05-03'),
    text: 'I’ve been looking for a yoga teacher for the longest time for my back pain. I took 3 classes with her and my back pain disappeared. I can’t Thank you enough Ritu ma’am. You healed me when I thought I never could. Keep up the good work. Thank you again.',
  },
  {
    initials: 'H',
    name: 'Hemant',
    avatar: hemantImg,
    rating: 5,
    date: relativeDate('2026-05-03'),
    text: "I recently tried a few sessions of guided meditation with Ritu and she's been quite helpful to centre my thoughts. Which I had find very hard to observe when sitting still with my mind, let alone control. Thanks ritu for helping me breaking this barrier.",
  },
  {
    initials: 'KS',
    name: 'Karandeep Singh',
    avatar: karanImg,
    rating: 5,
    date: relativeDate('2026-05-02'),
    text: "One of the most calming experiences I've had. Ritu's expertise in hatha yoga and sound healing creates an environment that is very special and tranquil. Every session feels healing and easy to follow. My back pain has reduced a lot after her sessions.Can't wait to come back again.",
  },
  {
    initials: 'KL',
    name: 'Kusam Lata',
    avatar: '',
    rating: 5,
    date: relativeDate('2026-05-04'),
    text: "I attended Sound meditation with Ritu ji. I could stay focused and at peace. Usually I can't stay in one posture for long, but with Ritu ji's guidance I could. Looking forward for next session.",
  },
]
