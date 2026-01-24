# Implementation Phases

## Phase 1: Template Foundation (10-12 hours)

**Objective:** Create the base template structure

**Tasks:**
1. Initialize Next.js 15 project with TypeScript and Tailwind
2. Set up TinaCMS with all collections
3. Create site settings schema (colors, fonts, layouts)
4. Build ThemeProvider component
5. Create CSS variable system

**Commands:**
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir
npx @tinacms/cli@latest init
npm install lucide-react
```

**Key Files:**
- `tina/config.ts` - TinaCMS configuration
- `tina/collections/settings.ts` - Site settings schema
- `components/providers/ThemeProvider.tsx` - CSS variable injection
- `styles/globals.css` - CSS variables definition

---

## Phase 2: Layout System (8-10 hours)

**Objective:** Build navbar, footer, and layout variants

**Tasks:**
1. Build 3 navbar variants (Floating, Fixed, Transparent)
2. Build 3 footer variants (Full, Minimal, Centered)
3. Build 3 homepage layouts (Standard, HeroFull, Minimal)
4. Create layout switching logic based on settings
5. Mobile responsive menu

**Directory Structure:**
```
components/
├── layout/
│   ├── Navbar/
│   │   ├── index.tsx      # Switches based on settings
│   │   ├── Floating.tsx
│   │   ├── Fixed.tsx
│   │   └── Transparent.tsx
│   ├── Footer/
│   │   ├── index.tsx
│   │   ├── Full.tsx
│   │   ├── Minimal.tsx
│   │   └── Centered.tsx
│   └── MobileMenu.tsx
```

---

## Phase 3: Block Components (12-15 hours)

**Objective:** Build all 15 section block components

**Tasks:**
1. Create BlockRenderer component (switch statement)
2. Build all 15 blocks with Tailwind styling
3. Ensure blocks respect theme CSS variables
4. Integrate Lucide icons
5. Test visual editing in TinaCMS

**Directory Structure:**
```
components/
├── blocks/
│   ├── BlockRenderer.tsx
│   ├── TextBlock.tsx
│   ├── HeroBanner.tsx
│   ├── ImageTextLeft.tsx
│   ├── ImageTextRight.tsx
│   ├── CardsGrid.tsx
│   ├── CtaBox.tsx
│   ├── Faq.tsx
│   ├── ImageGallery.tsx
│   ├── ContactInfo.tsx
│   ├── Stats.tsx
│   ├── Testimonials.tsx
│   ├── Video.tsx
│   ├── Timeline.tsx
│   ├── Team.tsx
│   └── Divider.tsx
```

---

## Phase 4: Demo Content (6-8 hours)

**Objective:** Create realistic "Horizon Community Foundation" content

**Demo Organization:**
- Name: Horizon Community Foundation
- Type: Non-profit / Community organization
- Mission: Building stronger communities through education and empowerment

**Demo Pages:**
1. Home - Full homepage with all sections
2. About Us - Organization history, mission, values
3. Programs:
   - Youth Leadership
   - Adult Education
   - Community Wellness
   - Digital Skills
4. Initiatives - Community Garden, Mentorship Network, Annual Gala
5. Partners - Logo grid with descriptions
6. Events - Upcoming events
7. Gallery - Photo collection
8. Get Involved - Volunteer, donate, contact
9. Contact - Form and contact info

---

## Phase 5: Documentation & Polish (6-8 hours)

**Objective:** Make template ready for public/reuse

**Documentation Files:**
- `README.md` - Project overview, quick start
- `docs/GETTING_STARTED.md` - Detailed setup guide
- `docs/CUSTOMIZATION.md` - How to customize branding
- `docs/BLOCKS.md` - All block types with examples
- `docs/DEPLOYMENT.md` - Netlify/Vercel deployment

**Tasks:**
1. Write comprehensive README
2. Add code comments
3. Create `.env.example`
4. Test deployment to Netlify
5. Create demo video/screenshots

---

## Phase 6: Al Bassem Implementation (8-10 hours)

**Objective:** Fork template and create Al Bassem site

**Tasks:**
1. Fork/clone template to new repo
2. Update site settings:
   - Name: Al Bassem Organization
   - Colors: #476A7D (primary), #A4C685 (secondary)
   - Logo: Al Bassem logos
3. Migrate content from bassemOrg/data/*.json
4. Create all pages with appropriate blocks
5. Test thoroughly
6. Deploy to Netlify (albassem.netlify.app)

**Content to Migrate:**
- 6 services → Programs/Services pages
- 3 initiatives → Initiatives pages
- 7 partnerships → Partners page
- Hero slides → Homepage hero
- Portfolio images → Gallery
- Contact info → Contact page
- Navigation → Site navigation

---

## Timeline Summary

| Phase | Description | Hours | Cumulative |
|-------|-------------|-------|------------|
| 1 | Foundation | 10-12 | 10-12 |
| 2 | Layout System | 8-10 | 18-22 |
| 3 | Block Components | 12-15 | 30-37 |
| 4 | Demo Content | 6-8 | 36-45 |
| 5 | Documentation | 6-8 | 42-53 |
| 6 | Al Bassem | 8-10 | 50-63 |

**With 20% buffer: 60-76 hours total**
