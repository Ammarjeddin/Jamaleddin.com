# Jamaleddin.com - Project Overview

## Purpose
A consulting agency website for **Jamaleddin LLC** built with Next.js 16+ and React 19. Features a block-based CMS, e-commerce shop, and admin dashboard.

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

## Site Configuration
- **Site Name**: Jamaleddin LLC
- **Tagline**: Consulting Agency
- **Primary Color**: #1a365d (dark blue)
- **Secondary Color**: #2563eb (bright blue)
- **Accent Color**: #f59e0b (amber)
- **Contact**: contact@jamaleddin.com

## Key Features

### Public Site (`/`)
- Homepage with hero, blocks, and services
- About page
- Contact page
- Programs/Services (business-strategy, technology-consulting, growth-advisory)
- Shop with Stripe checkout
- Gallery

### Admin Dashboard (`/dashboard`)
- Visual editor with live preview
- Settings editor (7 tabs)
- Content CRUD via API routes
- Media library browser
- Products management
- Subscriptions management
- Orders tracking
- Publishing workflow

### Layout Configuration
- **Homepage**: Standard layout
- **Navbar**: Floating (frosted glass pill)
- **Footer**: Full (4-column)
- **CTA Button**: "Get Started" → /contact

### 17+ Block Types
Text, HeroBanner, ImageTextLeft, ImageTextRight, CardsGrid, CtaBox, FAQ, ImageGallery, ContactInfo, Stats, Testimonials, Video, Timeline, Team, Divider, ProductGrid, ProductShowcase

### Shop / E-Commerce
- Product data from `content/products/*.json`
- Cart: React Context + localStorage persistence
- Stripe Checkout Sessions

### Content Structure
```
content/
├── admin/users.json
├── settings/site.json
├── home/index.json
├── pages/about.json, contact.json
└── programs/business-strategy.json, technology-consulting.json, growth-advisory.json
```

### Route Architecture
- **Route Group `(site)/`**: Public pages with Navbar + Footer
- **Dashboard**: Separate layout, forces light mode
- **Login**: Standalone page

## Architecture Notes
- A comprehensive architectural review exists in `ARCHITECTURE_REVIEW.md`
- Dark mode: Uses Tailwind `dark:` classes with flash-free implementation
- All components using dark mode context have `"use client"` directive