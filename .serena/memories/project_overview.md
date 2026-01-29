# Site Template - Project Overview

## Purpose
A reusable, white-label website template built with Next.js 16+ and React 19. Designed to be forked/cloned and customized for any organization through the admin dashboard.

## Tech Stack
- **Framework**: Next.js 16.1.4 (App Router)
- **React**: 19.2.3
- **CMS**: Custom Admin Dashboard (file-based JSON content)
- **Styling**: Tailwind CSS v4 with PostCSS
- **Icons**: Lucide Icons (lucide-react)
- **Language**: TypeScript 5+ (strict mode)
- **Auth**: JWT (jsonwebtoken) + bcrypt (bcryptjs)
- **E-commerce**: Stripe Checkout Sessions (server-side redirect)
- **Content**: File-based JSON in `content/` directory
- **GitHub Integration**: Optional draft/publish workflow via GitHub API

## Architecture Review
A comprehensive architectural review was completed on Jan 28, 2026.
- **Review file**: `ARCHITECTURE_REVIEW.md` (1,506 lines, ~65KB)
- **Scope**: All ~120 source files across 8 domains
- **Issues found**: 80 total (4 Critical, 8 High, 28 Medium, 40 Low)

### Critical Issues Identified
1. **Checkout price manipulation** — API trusts client-submitted prices (no server-side validation)
2. **Hardcoded JWT secret fallback** — `"your-super-secret-key-change-in-production"` used when env var missing
3. **Missing Stripe webhook** — No `checkout.session.completed` handler for order fulfillment
4. **ThemeProvider CSS specificity conflict** — Inline styles override dark mode CSS rules for `--color-background` and `--color-text`

### High-Severity Issues
- Home page ignores CMS blocks (hardcoded JSX instead)
- Edge middleware only checks cookie existence, not JWT validity
- TinaCMS pages collection format mismatch (mdx vs json)
- POST content route missing `content/admin/` path restriction
- No rate limiting on login endpoint
- No Stripe session validation on success page
- FixedNavbar/TransparentNavbar lack dark mode support
- Rules of Hooks violation in MobileMenu (conditional useCart/useDarkMode)

## Dark Mode
- Uses `useDarkMode()` hook from `@/contexts/DarkModeContext`
- **Flash-free implementation**: Blocking inline script in `<head>` applies dark class before React hydrates
- All components now use Tailwind `dark:` classes consistently (no inline styles based on isDarkMode)
- Components using dark mode context must have `"use client"` directive
- Admin dashboard forces light mode via `ForceLightMode` component

## Key Features

### Admin Dashboard (`/dashboard`)
- Visual editor with live preview (VisualEditor.tsx, 1,474 lines)
- Settings editor with tabbed interface (7 tabs)
- Content CRUD via API routes
- Media library browser (read-only, upload not implemented)
- Publishing workflow (UI exists but hardcoded to disabled)

### Layout Variants
- **Homepage**: Standard (floating navbar, medium hero), Hero-Full (transparent navbar, full-screen hero), Minimal (fixed navbar, text-only hero)
- **Navbar**: Floating (frosted glass pill), Fixed (solid white bar), Transparent (scroll-transition)
  - All variants support customizable CTA button (text, link, enable/disable via dashboard)
- **Footer**: Full (4-column), Minimal (single row), Centered (vertically stacked)

### Hero Transitions
- **HeroSection (slideshow)**: Smooth crossfade transitions between slides (1s duration)
- **HeroBanner (single image)**: Static display (Ken Burns effect removed to prevent overflow)

### 17 Block/Section Types
1. Text Block — Server component, dangerouslySetInnerHTML
2. Hero Banner — Server component, height variants
3. Image + Text (Left) — Server component
4. Image + Text (Right) — Server component (near-duplicate of Left)
5. Cards Grid — Server component, dynamic Lucide icons (full namespace import)
6. Call to Action — Server component, 4 style variants
7. FAQ / Accordion — Client component, useState
8. Image Gallery — Client component, 3 layouts + lightbox
9. Contact Info — Client component, form is non-functional stub
10. Stats / Numbers — Client component, useDarkMode inline styles
11. Testimonials — Client component, auto-advancing carousel
12. Video Embed — Client component, YouTube/Vimeo
13. Timeline — Client component, useDarkMode inline styles
14. Team Members — Server component
15. Divider / Spacer — Server component, 4 visual styles
16. Product Grid — Async server component
17. Product Showcase — Async server component

### Shop / E-Commerce
- Product data from `content/products/*.json` (file-based, no DB)
- Cart: React Context + useReducer + localStorage persistence
- Stripe Checkout Sessions (server-side redirect, no client Stripe.js)
- Missing: webhooks, inventory management, order storage, price validation

### Authentication
- JWT tokens with 7-day expiry, HTTP-only cookies
- bcrypt password hashing (salt rounds: 10)
- File-based user storage (`content/admin/users.json`)
- Two-tier auth: Edge middleware (cookie presence) + API handlers (JWT verification)
- Dev backdoor: `admin/admin` when NODE_ENV=development

### Content Pipeline
```
content/*.json → src/lib/content.ts (fs.readFileSync) → Page Components → Layout + BlockRenderer
```
- Content functions wrapped with `React.cache()` for request-level deduplication
- TinaCMS removed — all content managed via custom admin dashboard

### Route Architecture
- **Route Group `(site)/`**: Public pages share a persistent layout with Navbar + Footer
  - Layout fetches settings once, navbar/footer persist across navigation
  - Loading state (`loading.tsx`) shows spinner during page transitions
- **Dashboard**: Separate layout path, forces light mode
- **Login**: Standalone page outside route groups

### Dead Code
- `src/lib/fonts.ts` — Entire module never imported
- `defaultNavigation` in navigation.ts — Never imported
- `getStripePublishableKey()` in stripe.ts — Never called
- `useSiteSettings` hook — Only type export consumed
- `ContentEditor.tsx` — Replaced by VisualEditor, still in codebase
- Several user management functions in auth.ts — Never called externally

## Demo Content
Template includes realistic demo content for "Horizon Community Foundation" — a fictional non-profit organization.

## Related Files
- `ARCHITECTURE_REVIEW.md` — Full architectural review (80 issues, ~120 files analyzed)
- `TEMPLATE_PLAN.md` — Detailed implementation plan
- `MIGRATION_PLAN.md` — Technical Next.js + TinaCMS setup details