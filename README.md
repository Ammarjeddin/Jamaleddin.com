# Jamaleddin.com

The official website for **Jamaleddin** — a premium digital services company offering web development, design, and creative solutions.

**Live Site:** [jamaleddin.com](https://jamaleddin.com)

## About

Jamaleddin.com is a modern, dark-themed portfolio and services website built with Next.js. It showcases the company's services, portfolio work, and provides a seamless way for clients to get in touch.

## Features

- **Dark Mode First** — Elegant dark theme with gold accent colors
- **Glass Morphism UI** — Modern frosted glass effects throughout
- **Animated Dot Pattern** — Subtle animated background for visual depth
- **Responsive Design** — Mobile-first approach with fluid layouts
- **Expandable Mobile Menu** — App-like navigation with staggered animations
- **Services Showcase** — Filterable services/products grid
- **Shopping Cart** — Full e-commerce capability with Stripe integration
- **Admin Dashboard** — Content management system for pages and settings
- **SEO Optimized** — Static generation with Next.js 16

## Tech Stack

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [React 19](https://react.dev/) — UI library
- [Tailwind CSS 4](https://tailwindcss.com/) — Utility-first CSS
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Stripe](https://stripe.com/) — Payment processing
- [Lucide Icons](https://lucide.dev/) — Icon library

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
│   ├── pages/              # Page content
│   ├── products/           # Services/products
│   └── settings/           # Site settings
├── public/
│   └── images/             # Static assets, logos
├── src/
│   ├── app/
│   │   ├── (site)/         # Public pages
│   │   ├── api/            # API routes
│   │   └── dashboard/      # Admin dashboard
│   ├── components/
│   │   ├── blocks/         # Content block components
│   │   ├── layout/         # Navbar, Footer, MobileMenu
│   │   ├── shop/           # E-commerce components
│   │   └── ui/             # Shared UI components
│   └── lib/                # Utilities
```

## Branch Strategy

- **`main`** — Production branch (Netlify deploys from here)
- **`dev`** — Development branch for local changes
- **`content`** — Content branch for dashboard edits

## Deployment

Deployed on [Netlify](https://netlify.com) with automatic deployments from the `main` branch.

## Environment Variables

```env
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://jamaleddin.com
```

---

Built by Jamaleddin
