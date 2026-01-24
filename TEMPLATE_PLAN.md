# Website Template: Next.js + TinaCMS Starter Kit

## Overview

**Goal:** Build a reusable, white-label website template that can be customized for any organization in minutes through the admin dashboard.

**Approach:** Build the template first (generic), then use it to create the Al Bassem site as the first "client" implementation.

```
┌─────────────────────────────────────────────────────────────┐
│                    TEMPLATE REPOSITORY                       │
│              (nextjs-tinacms-starter)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   • 15 Block Components                                     │
│   • TinaCMS Visual Editing                                  │
│   • Theme System (colors, fonts, layouts)                   │
│   • Admin-editable Site Settings                            │
│   • Realistic Demo Content                                  │
│   • Ready for Netlify/Vercel deployment                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
    │  Al Bassem    │   │   Client B    │   │   Client C    │
    │   Website     │   │   Website     │   │   Website     │
    │               │   │               │   │               │
    │ Fork + Brand  │   │ Fork + Brand  │   │ Fork + Brand  │
    └───────────────┘   └───────────────┘   └───────────────┘
```

---

## Template Features

### 1. Admin-Editable Site Settings

All branding and theme settings editable from TinaCMS admin dashboard:

```typescript
// content/settings/site.json (editable via admin)
{
  "siteName": "Your Organization",
  "tagline": "Empowering communities through innovation",
  "logo": {
    "main": "/images/logo.png",
    "icon": "/images/favicon.png",
    "alt": "Organization Logo"
  },
  "theme": {
    "primaryColor": "#476A7D",
    "secondaryColor": "#A4C685", 
    "accentColor": "#E8B54D",
    "backgroundColor": "#E8EDEA",
    "textColor": "#1a1a1a"
  },
  "fonts": {
    "heading": "Plus Jakarta Sans",
    "body": "Inter"
  },
  "layout": {
    "homepage": "standard",      // "standard" | "hero-full" | "minimal"
    "navbar": "floating",        // "floating" | "fixed" | "transparent"
    "footer": "full"             // "full" | "minimal" | "centered"
  },
  "social": {
    "facebook": "",
    "instagram": "",
    "twitter": "",
    "linkedin": "",
    "youtube": ""
  },
  "analytics": {
    "googleAnalyticsId": "",
    "facebookPixelId": ""
  }
}
```

### 2. Theme System

**CSS Variables generated from admin settings:**

```css
/* Generated from site settings */
:root {
  --color-primary: var(--theme-primary);
  --color-secondary: var(--theme-secondary);
  --color-accent: var(--theme-accent);
  --color-background: var(--theme-background);
  --color-text: var(--theme-text);
  
  --font-heading: var(--theme-font-heading);
  --font-body: var(--theme-font-body);
}
```

**Theme Provider Component:**

```typescript
// components/ThemeProvider.tsx
'use client';

import { useEffect } from 'react';
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const settings = useSiteSettings();
  
  useEffect(() => {
    if (settings?.theme) {
      document.documentElement.style.setProperty('--theme-primary', settings.theme.primaryColor);
      document.documentElement.style.setProperty('--theme-secondary', settings.theme.secondaryColor);
      document.documentElement.style.setProperty('--theme-accent', settings.theme.accentColor);
      document.documentElement.style.setProperty('--theme-background', settings.theme.backgroundColor);
      document.documentElement.style.setProperty('--theme-text', settings.theme.textColor);
    }
  }, [settings]);
  
  return <>{children}</>;
}
```

### 3. Font Selection (Pre-configured Pairings)

Available font pairings editable from admin:

| Pairing Name | Heading Font | Body Font |
|--------------|--------------|-----------|
| Modern | Plus Jakarta Sans | Inter |
| Classic | Playfair Display | Source Sans Pro |
| Clean | Montserrat | Open Sans |
| Friendly | Nunito | Lato |
| Professional | Raleway | Roboto |
| Elegant | Cormorant Garamond | Proza Libre |

```typescript
// lib/fonts.ts
export const fontPairings = {
  modern: {
    heading: 'Plus Jakarta Sans',
    body: 'Inter',
  },
  classic: {
    heading: 'Playfair Display', 
    body: 'Source Sans Pro',
  },
  clean: {
    heading: 'Montserrat',
    body: 'Open Sans',
  },
  // ... more pairings
};
```

### 4. Layout Variants

**Homepage Layouts:**

```
┌─────────────────────────────────────────────────────────────┐
│ STANDARD                                                     │
├─────────────────────────────────────────────────────────────┤
│ [Navbar]                                                     │
│ [Hero Carousel - 60vh]                                       │
│ [About Section]                                              │
│ [Services Grid]                                              │
│ [CTA]                                                        │
│ [Portfolio/Gallery]                                          │
│ [Contact]                                                    │
│ [Footer]                                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ HERO-FULL                                                    │
├─────────────────────────────────────────────────────────────┤
│ [Transparent Navbar overlaying hero]                         │
│ [Full-screen Hero - 100vh]                                   │
│ [Content sections below]                                     │
│ ...                                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ MINIMAL                                                      │
├─────────────────────────────────────────────────────────────┤
│ [Simple Navbar]                                              │
│ [Text-based Hero - no image]                                 │
│ [Clean, whitespace-focused sections]                         │
│ ...                                                          │
└─────────────────────────────────────────────────────────────┘
```

**Navbar Variants:**
- `floating` - Detached with shadow, appears after scroll
- `fixed` - Always visible at top
- `transparent` - Transparent until scroll, then solid

**Footer Variants:**
- `full` - Logo, navigation, social links, newsletter signup
- `minimal` - Just copyright and essential links
- `centered` - Centered layout with social icons

---

## TinaCMS Schema for Settings

```typescript
// tina/collections/settings.ts

export const siteSettingsCollection = {
  name: 'siteSettings',
  label: 'Site Settings',
  path: 'content/settings',
  format: 'json',
  ui: {
    allowedActions: { create: false, delete: false },
    global: true, // Makes it appear in global menu
  },
  fields: [
    // Branding
    {
      type: 'string',
      name: 'siteName',
      label: 'Site Name',
      required: true,
    },
    {
      type: 'string',
      name: 'tagline',
      label: 'Tagline',
    },
    {
      type: 'object',
      name: 'logo',
      label: 'Logo',
      fields: [
        { type: 'image', name: 'main', label: 'Main Logo' },
        { type: 'image', name: 'icon', label: 'Favicon/Icon' },
        { type: 'image', name: 'light', label: 'Light Version (for dark backgrounds)' },
      ],
    },
    
    // Theme Colors
    {
      type: 'object',
      name: 'theme',
      label: 'Theme Colors',
      fields: [
        { 
          type: 'string', 
          name: 'primaryColor', 
          label: 'Primary Color',
          ui: { component: 'color' },
        },
        { 
          type: 'string', 
          name: 'secondaryColor', 
          label: 'Secondary Color',
          ui: { component: 'color' },
        },
        { 
          type: 'string', 
          name: 'accentColor', 
          label: 'Accent Color',
          ui: { component: 'color' },
        },
        { 
          type: 'string', 
          name: 'backgroundColor', 
          label: 'Background Color',
          ui: { component: 'color' },
        },
        { 
          type: 'string', 
          name: 'textColor', 
          label: 'Text Color',
          ui: { component: 'color' },
        },
      ],
    },
    
    // Typography
    {
      type: 'object',
      name: 'fonts',
      label: 'Typography',
      fields: [
        {
          type: 'string',
          name: 'pairing',
          label: 'Font Pairing',
          options: [
            { value: 'modern', label: 'Modern (Plus Jakarta Sans + Inter)' },
            { value: 'classic', label: 'Classic (Playfair Display + Source Sans Pro)' },
            { value: 'clean', label: 'Clean (Montserrat + Open Sans)' },
            { value: 'friendly', label: 'Friendly (Nunito + Lato)' },
            { value: 'professional', label: 'Professional (Raleway + Roboto)' },
            { value: 'elegant', label: 'Elegant (Cormorant Garamond + Proza Libre)' },
          ],
        },
      ],
    },
    
    // Layout Options
    {
      type: 'object',
      name: 'layout',
      label: 'Layout Options',
      fields: [
        {
          type: 'string',
          name: 'homepage',
          label: 'Homepage Layout',
          options: [
            { value: 'standard', label: 'Standard' },
            { value: 'hero-full', label: 'Full-screen Hero' },
            { value: 'minimal', label: 'Minimal' },
          ],
        },
        {
          type: 'string',
          name: 'navbar',
          label: 'Navbar Style',
          options: [
            { value: 'floating', label: 'Floating' },
            { value: 'fixed', label: 'Fixed' },
            { value: 'transparent', label: 'Transparent' },
          ],
        },
        {
          type: 'string',
          name: 'footer',
          label: 'Footer Style',
          options: [
            { value: 'full', label: 'Full' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'centered', label: 'Centered' },
          ],
        },
      ],
    },
    
    // Social Links
    {
      type: 'object',
      name: 'social',
      label: 'Social Media Links',
      fields: [
        { type: 'string', name: 'facebook', label: 'Facebook URL' },
        { type: 'string', name: 'instagram', label: 'Instagram URL' },
        { type: 'string', name: 'twitter', label: 'Twitter/X URL' },
        { type: 'string', name: 'linkedin', label: 'LinkedIn URL' },
        { type: 'string', name: 'youtube', label: 'YouTube URL' },
        { type: 'string', name: 'tiktok', label: 'TikTok URL' },
      ],
    },
    
    // Analytics
    {
      type: 'object',
      name: 'analytics',
      label: 'Analytics',
      fields: [
        { type: 'string', name: 'googleAnalyticsId', label: 'Google Analytics ID' },
        { type: 'string', name: 'facebookPixelId', label: 'Facebook Pixel ID' },
        { type: 'string', name: 'plausibleDomain', label: 'Plausible Domain' },
      ],
    },
    
    // SEO Defaults
    {
      type: 'object',
      name: 'seo',
      label: 'SEO Defaults',
      fields: [
        { type: 'string', name: 'titleTemplate', label: 'Title Template', description: 'e.g., "%s | Your Site Name"' },
        { type: 'string', name: 'defaultDescription', label: 'Default Description', ui: { component: 'textarea' } },
        { type: 'image', name: 'defaultOgImage', label: 'Default Social Image' },
      ],
    },
  ],
};
```

---

## Demo Content: "Horizon Community Foundation"

Realistic demo content for showcasing the template:

### Organization Profile

**Name:** Horizon Community Foundation  
**Tagline:** Building stronger communities through education and empowerment  
**Industry:** Non-profit / Community organization  

### Demo Pages

1. **Home** - Full homepage with all sections
2. **About Us** - Organization history, mission, values
3. **Programs** (Services equivalent)
   - Youth Leadership
   - Adult Education
   - Community Wellness
   - Digital Skills
4. **Initiatives**
   - Community Garden
   - Mentorship Network
   - Annual Gala
5. **Partners** - Logos and descriptions
6. **Events** - Upcoming events calendar
7. **Gallery** - Photo collection
8. **Get Involved** - Volunteer, donate, contact
9. **Contact** - Form and contact info

### Demo Content Examples

**Hero Section:**
```json
{
  "title": "Empowering Communities, One Step at a Time",
  "subtitle": "Join us in creating lasting change through education, mentorship, and community engagement.",
  "buttonText": "Get Involved",
  "buttonLink": "/get-involved",
  "backgroundImage": "/images/demo/hero-community.jpg"
}
```

**Services/Programs:**
```json
[
  {
    "title": "Youth Leadership Program",
    "description": "Developing the next generation of community leaders through mentorship, workshops, and real-world projects.",
    "icon": "users",
    "slug": "youth-leadership"
  },
  {
    "title": "Adult Education",
    "description": "Providing accessible learning opportunities for adults seeking to advance their careers and personal growth.",
    "icon": "graduation-cap",
    "slug": "adult-education"
  },
  {
    "title": "Community Wellness",
    "description": "Promoting physical and mental health through fitness programs, counseling services, and wellness workshops.",
    "icon": "heart",
    "slug": "community-wellness"
  },
  {
    "title": "Digital Skills Training",
    "description": "Bridging the digital divide with hands-on technology training for all ages and skill levels.",
    "icon": "laptop",
    "slug": "digital-skills"
  }
]
```

**Stats Section:**
```json
{
  "title": "Our Impact",
  "stats": [
    { "number": "2,500+", "label": "People Served Annually" },
    { "number": "15", "label": "Years of Service" },
    { "number": "50+", "label": "Community Partners" },
    { "number": "95%", "label": "Program Satisfaction" }
  ]
}
```

**Testimonial:**
```json
{
  "quote": "The Youth Leadership Program changed my life. I gained confidence, skills, and a network of mentors who continue to support me today.",
  "author": "Maria Santos",
  "role": "Program Graduate, 2024"
}
```

---

## Directory Structure (Template)

```
nextjs-tinacms-starter/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Homepage
│   │   ├── [slug]/
│   │   │   └── page.tsx                # Dynamic pages
│   │   ├── programs/
│   │   │   └── [slug]/page.tsx         # Program detail pages
│   │   ├── events/
│   │   │   └── page.tsx
│   │   ├── gallery/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   │
│   ├── admin/
│   │   └── [[...filename]]/page.tsx    # TinaCMS admin
│   │
│   └── api/
│       └── tina/[...routes].ts
│
├── components/
│   ├── layout/
│   │   ├── Navbar/
│   │   │   ├── index.tsx
│   │   │   ├── Floating.tsx            # Navbar variant
│   │   │   ├── Fixed.tsx               # Navbar variant
│   │   │   └── Transparent.tsx         # Navbar variant
│   │   ├── Footer/
│   │   │   ├── index.tsx
│   │   │   ├── Full.tsx                # Footer variant
│   │   │   ├── Minimal.tsx             # Footer variant
│   │   │   └── Centered.tsx            # Footer variant
│   │   └── MobileMenu.tsx
│   │
│   ├── blocks/                         # 15 block components
│   │   ├── TextBlock.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── ImageTextLeft.tsx
│   │   ├── ImageTextRight.tsx
│   │   ├── CardsGrid.tsx
│   │   ├── CtaBox.tsx
│   │   ├── Faq.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── ContactInfo.tsx
│   │   ├── Stats.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Video.tsx
│   │   ├── Timeline.tsx
│   │   ├── Team.tsx
│   │   ├── Divider.tsx
│   │   └── BlockRenderer.tsx
│   │
│   ├── home/
│   │   ├── layouts/
│   │   │   ├── Standard.tsx            # Homepage layout
│   │   │   ├── HeroFull.tsx            # Homepage layout
│   │   │   └── Minimal.tsx             # Homepage layout
│   │   ├── HeroCarousel.tsx
│   │   ├── ServicesGrid.tsx
│   │   ├── PartnersGrid.tsx
│   │   └── PortfolioGrid.tsx
│   │
│   ├── providers/
│   │   └── ThemeProvider.tsx           # Injects CSS variables
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Icon.tsx
│       └── Container.tsx
│
├── content/                            # Demo content (Git-tracked)
│   ├── settings/
│   │   └── site.json                   # Site settings (theme, layout, etc.)
│   ├── pages/
│   │   ├── about-us.md
│   │   ├── get-involved.md
│   │   └── ...
│   ├── programs/
│   │   ├── youth-leadership.md
│   │   ├── adult-education.md
│   │   └── ...
│   ├── home.json                       # Homepage content
│   ├── services.json
│   ├── initiatives.json
│   ├── partners.json
│   ├── hero.json
│   ├── portfolio.json
│   ├── navigation.json
│   ├── contact.json
│   └── events.json
│
├── lib/
│   ├── fonts.ts                        # Font pairing definitions
│   ├── hooks/
│   │   ├── useSiteSettings.ts
│   │   └── useTheme.ts
│   └── utils/
│       └── cn.ts                       # classnames utility
│
├── tina/
│   ├── config.ts                       # Main TinaCMS config
│   ├── collections/
│   │   ├── pages.ts
│   │   ├── settings.ts                 # Site settings schema
│   │   ├── services.ts
│   │   └── ...
│   └── blocks.ts                       # Block template definitions
│
├── public/
│   ├── images/
│   │   └── demo/                       # Demo images
│   └── fonts/                          # Self-hosted fonts (optional)
│
├── styles/
│   └── globals.css                     # Tailwind + CSS variables
│
├── .env.example                        # Environment template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md                           # Template documentation
```

---

## Implementation Plan

### Phase 1: Template Foundation (10-12 hours)

**Objective:** Create the base template structure

**Tasks:**
1. Initialize Next.js 15 project with TypeScript and Tailwind
2. Set up TinaCMS with all collections
3. Create site settings schema (colors, fonts, layouts)
4. Build ThemeProvider component
5. Create CSS variable system

**Deliverables:**
- Working Next.js + TinaCMS project
- Site settings editable in admin
- Theme colors applying dynamically

---

### Phase 2: Layout System (8-10 hours)

**Objective:** Build navbar, footer, and layout variants

**Tasks:**
1. Build 3 navbar variants (floating, fixed, transparent)
2. Build 3 footer variants (full, minimal, centered)
3. Build 3 homepage layouts (standard, hero-full, minimal)
4. Create layout switching logic based on settings
5. Mobile responsive menu

**Deliverables:**
- All layout variants working
- Settings switch layouts in real-time
- Mobile responsive

---

### Phase 3: Block Components (12-15 hours)

**Objective:** Build all 15 section block components

**Tasks:**
1. Create BlockRenderer component
2. Build all 15 blocks:
   - TextBlock, HeroBanner
   - ImageTextLeft, ImageTextRight
   - CardsGrid, CtaBox, Faq
   - ImageGallery, ContactInfo
   - Stats, Testimonials, Video
   - Timeline, Team, Divider
3. Style with Tailwind (using CSS variables)
4. Lucide icons integration

**Deliverables:**
- All 15 blocks built and styled
- Blocks respect theme colors
- Visual editing works

---

### Phase 4: Demo Content (6-8 hours)

**Objective:** Create realistic "Horizon Community Foundation" content

**Tasks:**
1. Write all demo page content
2. Create demo images (or source from Unsplash)
3. Set up navigation structure
4. Configure demo settings (colors, fonts, layout)
5. Test full site flow

**Deliverables:**
- Complete demo site
- Realistic content throughout
- All features showcased

---

### Phase 5: Documentation & Polish (6-8 hours)

**Objective:** Make template ready for public/reuse

**Tasks:**
1. Write comprehensive README
2. Create "Getting Started" guide
3. Document all block types with examples
4. Add code comments
5. Create `.env.example`
6. Test deployment to Netlify/Vercel
7. Create "How to customize" guide

**Deliverables:**
- Complete documentation
- Easy setup process
- Deployment ready

---

### Phase 6: Al Bassem Implementation (8-10 hours)

**Objective:** Fork template and create Al Bassem site

**Tasks:**
1. Fork/clone template
2. Replace demo content with Al Bassem content
3. Update branding (logo, colors: #476A7D, #A4C685)
4. Configure font pairing
5. Migrate existing content from JSON files
6. Test thoroughly
7. Deploy to Netlify

**Deliverables:**
- Al Bassem site live
- All content migrated
- Admin access working

---

## Timeline Summary

| Phase | Description | Hours |
|-------|-------------|-------|
| 1 | Template Foundation | 10-12 |
| 2 | Layout System | 8-10 |
| 3 | Block Components | 12-15 |
| 4 | Demo Content | 6-8 |
| 5 | Documentation | 6-8 |
| 6 | Al Bassem Implementation | 8-10 |
| **Total** | | **50-63 hours** |

**Buffer (20%):** 10-13 hours  
**Grand Total:** **60-76 hours**

---

## Benefits

1. **Reusable** - Create new sites in hours, not weeks
2. **Consistent** - Same quality across all client sites
3. **Maintainable** - Update template, all sites benefit
4. **Customizable** - Colors, fonts, layouts from admin
5. **No-code friendly** - Content editors can fully customize
6. **SEO optimized** - Static generation by default
7. **Git-based** - Full version history, easy rollbacks
8. **Free hosting** - Netlify/Vercel free tier

---

## Quick Setup for New Client (After Template is Built)

```bash
# 1. Clone template
git clone https://github.com/yourname/nextjs-tinacms-starter.git new-client-site
cd new-client-site

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open admin (localhost:3000/admin)
# - Update Site Settings (name, logo, colors)
# - Replace demo content
# - Add client's pages and services

# 5. Deploy to Netlify
# - Connect GitHub repo
# - Auto-deploys on every push

# Total time: 2-4 hours for basic customization
```

---

## Future Enhancements (Post-MVP)

- [ ] Additional block types (pricing table, countdown, map embed)
- [ ] Dark mode support
- [ ] Multi-language (i18n)
- [ ] Blog/News section
- [ ] Events calendar integration
- [ ] Newsletter signup (Mailchimp/ConvertKit)
- [ ] Form builder for contact forms
- [ ] Page templates (landing page, service page, etc.)
- [ ] Import/export site settings
- [ ] One-click demo data reset
