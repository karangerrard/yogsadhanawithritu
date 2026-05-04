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
    'Holistic online and corporate wellness experiences integrating yoga, pranayama, meditation, ayurveda, nutrition, and sound healing for sustainable well being.',

  // ── CTA Buttons ────────────────────────────────────────────────────────────
  primaryCta: {
    label: 'Book Session',
    href: '#contact',
  },
  secondaryCta: {
    label: 'View Schedule',
    href: '#video',
  },

  // ── Stats strip at bottom of hero ─────────────────────────────────────────
  stats: [
    { icon: 'leaf',  title: 'Reduce Stress',    description: 'Feel calmer and more balanced' },
    { icon: 'lotus', title: 'Improve Focus',    description: 'Sharpen your mind and productivity' },
    { icon: 'heart', title: 'Better Well-being', description: 'Sleep better and boost your energy' },
  ],
} as const
