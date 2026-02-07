# Jamaleddin.com

The official website for **Jamaleddin LLC** — a premium consulting agency offering web development, design, and creative solutions.

**Live Site:** [jamaleddin.com](https://jamaleddin.com)

## About

Jamaleddin.com is a modern, dark-themed portfolio and services website built with Next.js. It showcases the company's services, portfolio work, and provides a seamless way for clients to get in touch.

## Features

- **Dark Mode First** — Elegant dark theme with gold accent colors (#E8B54D)
- **Glass Morphism UI** — Modern frosted glass effects throughout
- **Animated Dot Pattern** — Subtle animated background for visual depth
- **Responsive Design** — Mobile-first approach with fluid layouts
- **Expandable Mobile Menu** — App-like navigation with staggered animations
- **Services Showcase** — Filterable services/products grid
- **Shopping Cart & Checkout** — Full e-commerce with Stripe integration (subscriptions & one-time payments)
- **Stripe Product Sync** — Products enriched with data from Stripe (name, description, price, images)
- **Stripe Prices Direct** — Uses Stripe Price IDs directly for multi-currency support
- **Adaptive Pricing** — Local currency display and payment methods for international customers
- **Auto Locale Detection** — Checkout language auto-detected from customer's browser
- **Admin Dashboard** — Content management system for pages, products, and settings
- **GitHub Content API** — Dashboard saves push to GitHub in production, git auto-commit locally
- **SEO Optimized** — Static generation with Next.js 16

## Tech Stack

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [React 19](https://react.dev/) — UI library
- [Tailwind CSS 4](https://tailwindcss.com/) — Utility-first CSS
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Stripe](https://stripe.com/) — Payment processing (Checkout Sessions, subscriptions)
- [Lucide Icons](https://lucide.dev/) — Icon library
- [Netlify](https://netlify.com) — Hosting & deployment

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
├── content/                 # Content files (JSON)
│   ├── admin/              # Admin users
│   ├── pages/              # Page content
│   ├── products/           # Products & services
│   └── settings/           # Site settings
├── public/
│   └── images/
│       ├── content/        # Content images
│       ├── hero/           # Hero section images
│       └── products/       # Product images
├── src/
│   ├── app/
│   │   ├── (site)/         # Public pages
│   │   │   └── shop/       # Cart, checkout, success pages
│   │   ├── api/            # API routes (content, checkout)
│   │   └── dashboard/      # Admin dashboard
│   ├── components/
│   │   ├── admin/          # Dashboard editors (ProductEditor, etc.)
│   │   ├── blocks/         # Content block components
│   │   ├── layout/         # Navbar, Footer, MobileMenu
│   │   ├── dashboard/      # Dashboard UI (MediaImageCard, etc.)
│   │   ├── shop/           # Cart, StripeCheckout, CartDrawer
│   │   └── ui/             # Shared UI components
│   ├── contexts/           # React contexts (CartContext)
│   └── lib/                # Utilities, types, Stripe & product helpers
```

## Branch Strategy

- **`main`** — Production branch (Netlify deploys from here)
- **`dev`** — Development branch for local changes
- **`content`** — Content branch for live dashboard edits (via GitHub API)

## Content Management

- **Production (Netlify):** Dashboard saves push content to GitHub via the GitHub API
- **Local Development:** Dashboard saves write to the filesystem and auto-commit to the current git branch

## Stripe Integration

- Products can be linked to Stripe via `stripeProductId` and `stripeTestProductId` fields
- The checkout route auto-detects test vs live mode based on the `STRIPE_SECRET_KEY` prefix
- Supports both one-time payments and recurring subscriptions
- Product data (name, description, price, images) is enriched from Stripe at runtime
- When a Stripe product has a default price, checkout uses the Stripe Price ID directly (no hardcoded currency)
- Stripe auto-detects customer location for local payment methods and language
- Enable Adaptive Pricing in Stripe Dashboard for automatic currency conversion (one-time payments only)

## Environment Variables

```env
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://jamaleddin.com
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-repo-name
GITHUB_CONTENT_BRANCH=content
```

## Deployment

Deployed on [Netlify](https://netlify.com) with automatic deployments from the `main` branch.

---

Built by Jamaleddin LLC | [info@jamaleddin.com](mailto:info@jamaleddin.com)
