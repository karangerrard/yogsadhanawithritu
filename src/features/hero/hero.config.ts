/**
 * ─── HERO SECTION CONFIG ──────────────────────────────────────────────────────
 *
 * 🖼️  TO SWAP THE YOGA POSE IMAGE:
 *
 *  OPTION A — Use a local file (recommended):
 *    1. Drop your image into:  src/assets/images/
 *    2. Import it below and assign it to `desktopImage` or `mobileImage`
 *    Example:
 *      import myPose from '@assets/images/my-new-pose.png'
 *      desktopImage: myPose,
 *
 *  OPTION B — Use a remote URL:
 *    Just paste the full URL as a string:
 *      desktopImage: 'https://example.com/my-pose.webp',
 *
 *  The desktop and mobile images are SEPARATE so you can use a
 *  wide/landscape crop for desktop and a tighter/portrait crop for mobile.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Step 1: Import your images here ─────────────────────────────────────────
 import desktopPose from '@assets/images/yoga_hero.jpg'   // ← uncomment & edit
 import mobilePose  from '@assets/images/yoga_hero.jpg'    // ← uncomment & edit

// ── Step 2: Reference them in the config below ───────────────────────────────
export const heroConfig = {
  // ── Images (swap these to update the yoga pose) ────────────────────────────
  desktopImage: desktopPose,  // ← update to your desktop image path or URL
  mobileImage:  mobilePose,   // ← update to your mobile image path or URL

  // Alt text for accessibility — update to describe your actual pose
  imageAlt: 'Woman sitting in a peaceful lotus meditation pose surrounded by leaves',

  // ── Copy ───────────────────────────────────────────────────────────────────
  headingLine1: 'Yogsadhana',                 // ← rendered in dark gray
  headingLine2: 'With Ritu',                  // ← rendered in brand green
  subheading:
    'Curated wellness experiences supporting clarity, balance, relaxation, and inner growth.',

  // ── Service offerings ──────────────────────────────────────────────────────
  // Displayed as a 2-column icon + label list below the subheading.
  // Gives visitors an instant scannable overview before they read further.
  // Edit labels freely. Stick to 4–6 items for visual balance.
  services: [
    { icon: '🧘', label: 'Yoga & Pranayama' },
    { icon: '🪷', label: 'Meditation' },
    { icon: '🌿', label: 'Ayurveda & Nutrition' },
    { icon: '🎵', label: 'Sound Healing' },
  ],

  // ── Session types ──────────────────────────────────────────────────────────
  // Pill badges that tell visitors immediately HOW they can work with you.
  // This answers the first question a B2B or individual visitor asks:
  // "Is this available to me / my organisation?"
  sessionTypes: [
    { label: 'Corporate Sessions' },
    { label: 'Online 1-on-1' },
    { label: 'Online Group Classes' },
    { label: 'Sound Healing Only Offline' },
    { label: 'Offline Individual and Group Classes' },
  ],

  // ── CTA Buttons ────────────────────────────────────────────────────────────
  primaryCta: {
    label: 'Book Demo',
    href: '#contact',
  },
  secondaryCta: {
    label: 'Contact Us',
    href: '#contact',
  },

  // ── Stats strip at bottom of hero ─────────────────────────────────────────
  stats: [
    { icon: 'leaf',  title: 'Reduce Stress',    description: 'Feel calmer and more balanced' },
    { icon: 'lotus', title: 'Improve Focus',    description: 'Sharpen your mind and productivity' },
    { icon: 'heart', title: 'Better Well-being', description: 'Sleep better and boost your energy' },
  ],
} as const
