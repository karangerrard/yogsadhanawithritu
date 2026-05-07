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
      qualification: 'Masters in Yogacharya',
      detail: '8 CGPA',
    },
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
    {
      institution: 'Uttarakhand Sanskrit University, Haridwar',
      qualification: 'Master’s in yogic science',
      detail: 'Specialization in Hatha Yoga',
    },
    {
      institution: 'Rishikesh Vinyasa Yoga School, Rishikesh',
      qualification: 'PGD in Ayurveda & Nutrition Diet',
      detail: 'Ashtanga Vinyasa',
    }
  ],

  experience: [
    {
      institution: 'Rishikesh Vinyasa Yoga School, Rishikesh',
      role: 'Assistant Teacher',
    },
  ],
}
