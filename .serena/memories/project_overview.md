# Jamaleddin.com - Project Overview

## Purpose
A consulting agency website for **Jamaleddin LLC** built with Next.js 16+ and React 19. Features a block-based CMS, services/shop, and admin dashboard.

## Tech Stack
- **Framework**: Next.js 16.1.4 (App Router)
- **React**: 19.2.3
- **CMS**: Custom Admin Dashboard (file-based JSON content)
- **Styling**: Tailwind CSS v4 with PostCSS
- **Icons**: Lucide Icons (lucide-react)
- **Language**: TypeScript 5+ (strict mode)
- **Auth**: JWT (jose) + bcrypt (bcryptjs)
- **E-commerce**: Stripe Checkout Sessions (server-side redirect)
- **Content**: File-based JSON in `content/` directory

## Design System
- **Theme**: Dark mode (Obsidian #030303 background)
- **Accent Color**: Gold #E8B54D (#B8A04A in settings)
- **Glass Morphism**: Semi-transparent cards with backdrop-blur
- **Animations**: Dot pattern background with wave ripples, scroll-triggered navbar glow

## Site Configuration
- **Site Name**: Jamaleddin LLC
- **Tagline**: Consulting Agency
- **Homepage**: Minimal layout
- **Navbar**: Floating (frosted glass pill with gold glow animation)
- **Footer**: Minimal

## Key Features

### Public Site (`/`)
- Homepage with hero and blocks
- About page
- Contact page
- Services (shop functionality)
- Programs

### Admin Dashboard (`/dashboard`)
- Visual editor with live preview
- Settings editor (7 tabs)
- Content CRUD via API routes
- Media library browser
- Products management
- Subscriptions management
- Orders tracking
- Publishing workflow

### 17+ Block Types
Text, HeroBanner, ImageTextLeft, ImageTextRight, CardsGrid, CtaBox, FAQ, ImageGallery, ContactInfo, Stats, Testimonials, Video, Timeline, Team, Divider, ProductGrid, ProductShowcase

### Content Structure
```
content/
├── admin/users.json
├── settings/site.json
├── home/index.json
├── pages/about.json, contact.json
├── programs/*.json
└── products/*.json
```

### Route Architecture
- **Route Group `(site)/`**: Public pages with Navbar + Footer
- **Dashboard**: Separate layout, dark theme
- **Login**: Standalone page

## Mobile Optimization (Feb 2026)
- Touch targets minimum 44px throughout
- Responsive typography scaling
- Touch feedback (active states)
- Mobile menu with slide-in animation
- Increased first section padding to prevent navbar overlap

## Architecture Notes
- Dark mode enforced site-wide
- All components use Tailwind responsive prefixes (sm:, md:, lg:)
- Glass morphism cards with `.glass-card` CSS class
- Cart icon only shows when items in cart
- Navbar CTA button disabled