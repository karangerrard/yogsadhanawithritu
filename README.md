# 🧘 ZenLife — Yoga Landing Page

A production-ready, fully responsive yoga wellness landing page built with **React + Vite + TypeScript**.

---

## 🚀 Quick Start

```bash
# 1. Clone / unzip the project
cd zenlife

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and fill in your API keys (optional for dev)

# 4. Start the dev server
npm run dev
# → Opens at http://localhost:3000
```

---

## 🖼️ Swapping the Yoga Pose Image

**This is the only file you need to edit:**

```
src/features/hero/hero.config.ts
```

### Option A — Local image file (recommended)
1. Drop your image into `src/assets/images/` (e.g. `warrior-pose.png`)
2. Open `hero.config.ts` and uncomment + update:
   ```ts
   import myPose from '@assets/images/warrior-pose.png'
   
   desktopImage: myPose,
   mobileImage:  myPose,   // or a different crop for mobile
   ```

### Option B — Remote URL
```ts
desktopImage: 'https://your-cdn.com/new-pose.webp',
mobileImage:  'https://your-cdn.com/new-pose-mobile.webp',
```

> ✅ Desktop and mobile images are **separate** — use a landscape crop for desktop and a tighter portrait crop for mobile.

---

## 📁 Project Structure

```
zenlife/
├── index.html                    # Vite HTML entry (fonts loaded here)
├── vite.config.ts                # Path aliases, build config
├── tsconfig.app.json             # TypeScript strict config
├── .env.example                  # Environment variable template
│
└── src/
    ├── main.tsx                  # App bootstrap + global CSS
    ├── App.tsx                   # Root: Navbar + Page + Footer
    │
    ├── assets/
    │   └── images/               # ← Drop your yoga pose images here
    │
    ├── features/
    │   ├── hero/
    │   │   ├── hero.config.ts    # ← EDIT THIS to swap images & text
    │   │   ├── HeroSection.tsx
    │   │   └── HeroSection.module.css
    │   ├── services/
    │   │   ├── services.config.ts   # Edit service cards here
    │   │   └── ServicesSection.tsx
    │   ├── testimonials/
    │   │   ├── testimonials.config.ts  # Edit Google reviews here
    │   │   └── TestimonialsSection.tsx
    │   └── contact/
    │       ├── contact.config.ts    # Edit contact info here
    │       └── ContactSection.tsx
    │
    ├── hooks/
    │   ├── useScrollReveal.ts    # Fade-in on scroll (no library needed)
    │   └── useMediaQuery.ts      # Reactive breakpoint detection
    │
    ├── layouts/
    │   ├── Navbar.tsx            # Responsive navbar + mobile hamburger
    │   └── Footer.tsx
    │
    ├── pages/
    │   └── HomePage.tsx          # Composes all 4 sections
    │
    ├── styles/
    │   └── globals.css           # CSS variables, tokens, reset
    │
    └── types/
        └── index.ts              # Shared TypeScript interfaces
```

---

## ✏️ Editing Content

Every section has a dedicated **config file** — no need to touch the component code:

| Section | Config file |
|---|---|
| Hero (image, heading, CTAs) | `src/features/hero/hero.config.ts` |
| Services (cards) | `src/features/services/services.config.ts` |
| Google Testimonials | `src/features/testimonials/testimonials.config.ts` |
| Contact (email, phone, location) | `src/features/contact/contact.config.ts` |

---

## 📐 Responsive Design

The layout uses **CSS fluid clamp()** values for typography and spacing — one set of values scales gracefully across all screen sizes (320px phones → 1440px+ desktops) with **zero media query hacks**.

Breakpoints used:
- `≤ 767px` — Mobile (stacked layout, hamburger menu)
- `768–1023px` — Tablet (2-column grid)
- `≥ 1024px` — Desktop (full side-by-side layout)

---

## 🏗️ Build & Deploy

```bash
# Build for production
npm run build
# Output → dist/

# Preview production build locally
npm run preview

# Lint
npm run lint

# Format
npm run format
```

Deploy the `dist/` folder to **Vercel**, **Netlify**, or any static host.

---

## 🎨 Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-sage-light` | `#CAD2C5` | Backgrounds, icon circles |
| `--color-sage` | `#84A98C` | Accents, labels |
| `--color-sage-dark` | `#52796F` | Buttons, hover states |
| `--color-sage-deeper` | `#354F52` | Headings, logo, footer |
| `--color-cream` | `#F5F5F0` | Page background |

All tokens live in `src/styles/globals.css`.
