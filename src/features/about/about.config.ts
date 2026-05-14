/**
 * ─── ABOUT SECTION CONFIG ─────────────────────────────────────────────────────
 *
 * 🖼️  TO ADD YOUR TRANSPARENT PNG:
 *   1. Drop your .png into: src/assets/images/
 *   2. Import it below and set it as `guideImage`
 *   Example:
 *     import myPhoto from '@assets/images/your-photo.png'
 *     guideImage: myPhoto,
 * ─────────────────────────────────────────────────────────────────────────────
 */

 import aboutPhoto from '@assets/images/about_me.png'  // ← uncomment when ready

export const aboutConfig = {
  sectionTitle: 'About Your Guide',

  // ── Your image ──────────────────────────────────────────────────────────────
  // Replace with your imported transparent PNG when ready.
  // The placeholder below will be replaced by your image.
  guideImage: aboutPhoto,
  guideImageAlt: 'Yoga and sound healing guide in meditation',

  // ── Intro bio ───────────────────────────────────────────────────────────────
  // Write 2–3 sentences about yourself here
  bio: 'Rooted in the traditions of Rishikesh, I blend yoga, breathwork, and sound healing to bring balance into everyday life. My sessions are designed to help you find stillness, whether you are beginning your journey or deepening your practice.',

  // ── Credentials ─────────────────────────────────────────────────────────────
  education: [
    {
      institution: 'Uttarakhand Sanskrit University, Haridwar',
      qualification: 'Masters in Yogic Science',
      detail: '8 CGPA',
    },
    {
      institution: 'Arogyam Institute, Jalandhar',
      qualification: 'PGD in Ayurveda & Nutrition Diet',
      detail: '',
    }
  ],

  certifications: [
    {
      institution: 'Vinyasa Yoga School, Rishikesh',
      qualification: '500 Hours Yoga TTC',
      detail: 'Ashtanga Vinyasa',
    },
    {
      institution: 'Om Yoga Academy, Rishikesh',
      qualification: '200 Hours Yoga TTC',
      detail: 'Hatha Yoga',
    },
    {
      institution: 'Rama Space Sound Healing, Rishikesh',
      qualification: 'Sound Healing Teacher',
      detail: 'Level 1, 2 & 3',
    },
    {
      institution: 'Yog Upasana, Rishikesh',
      qualification: '3-Month Intensive',
      detail: 'Hatha & Iyengar Yoga',
    },
    {
      institution: 'Pancha Koshas, Rishikesh',
      qualification: 'Aerial Yoga Training',
      detail: 'Level 1 & 2',
    },
  ],

  experience: [
    {
      institution: 'Rishikesh Vinyasa Yoga School, Rishikesh',
      role: 'Assistant Teacher',
      detail: '2 years of online & offline experience',
    },
    {
      institution: 'Rama Space Sound Healing, Rishikesh',
      role: 'Sound Therapist',
      detail: '2 years (2022-2024)',
    },
    {
      institution: '',
      role: 'Yoga & Sound Therapist',
      detail: 'From 2024 - Present',
    },
  ],
}
