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
// import desktopPose from '@assets/images/hero-desktop.png'   // ← uncomment & edit
// import mobilePose  from '@assets/images/hero-mobile.png'    // ← uncomment & edit

// ── Step 2: Reference them in the config below ───────────────────────────────
export const heroConfig = {
  // ── Images (swap these to update the yoga pose) ────────────────────────────
  desktopImage: 'https://placehold.co/600x560/CAD2C5/52796F?text=Your+Yoga+Pose+Here',
  mobileImage:  'https://placehold.co/400x380/CAD2C5/52796F?text=Your+Yoga+Pose+Here',

  // Alt text for accessibility — update to describe your actual pose
  imageAlt: 'Woman sitting in a peaceful lotus meditation pose surrounded by leaves',

  // ── Copy ───────────────────────────────────────────────────────────────────
  headingLine1: 'Find Your',
  headingLine2: 'Inner Peace',                  // ← rendered in brand green
  subheading:
    'Simple daily practices to reduce stress, improve focus, and bring calm to your everyday life.',

  // ── CTA Buttons ────────────────────────────────────────────────────────────
  primaryCta: {
    label: 'Start Your Journey',
    href: '#contact',
  },
  secondaryCta: {
    label: 'Watch Video',
    href: '#video',
  },

  // ── Stats strip at bottom of hero ─────────────────────────────────────────
  stats: [
    { icon: 'leaf',  title: 'Reduce Stress',    description: 'Feel calmer and more balanced' },
    { icon: 'lotus', title: 'Improve Focus',    description: 'Sharpen your mind and productivity' },
    { icon: 'heart', title: 'Better Well-being', description: 'Sleep better and boost your energy' },
  ],
} as const
