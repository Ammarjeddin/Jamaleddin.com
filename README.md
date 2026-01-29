# Next.js Website Template

A reusable, white-label website template with an admin dashboard and optional e-commerce. Customize branding, colors, fonts, and layouts directly from the admin dashboard or content files.

## Demo

This template includes a complete demo site for "Horizon Community Foundation" - a fictional nonprofit organization showcasing all features and block types.

## Features

### Core Features
- **17 Block Types** - Text, Hero, Cards, FAQ, Gallery, Stats, Testimonials, Timeline, Team, Product Grid, and more
- **Git-Based Content** - All content stored as JSON in your repository
- **Theme Customization** - Colors, fonts, layouts editable from settings
- **Dark Mode** - System-aware dark mode with manual toggle (flash-free)
- **Persistent Navigation** - Navbar and footer persist across page transitions using Next.js route groups
- **Smooth Hero Transitions** - Crossfade transitions between hero slideshow images
- **Layout Variants** - Multiple navbar (3), footer (3), and homepage (3) options
- **Customizable Navbar Button** - Configure button text, link, and enable/disable from dashboard
- **SEO Optimized** - Static generation with Next.js 16
- **Responsive** - Mobile-first design with Tailwind CSS 4
- **TypeScript** - Full type safety throughout

### E-Commerce (Optional)
- **Feature Toggle** - Enable/disable shop per deployment
- **Product Management** - Manage products through JSON content files or the admin dashboard
- **Shopping Cart** - Persistent cart with localStorage
- **Stripe Checkout** - Secure payment processing with webhook verification
- **Product Types** - Physical, digital, and service products
- **Inventory Tracking** - Stock management with "out of stock" display

### Admin Dashboard
- **Unified Entry Point** - Single dashboard for all admin functions
- **Content Management** - Quick access to Pages, Settings, and Media
- **Layout Settings** - Configure navbar variant, footer variant, homepage layout, and navbar button
- **Feature Status** - Visual indicators for enabled/disabled features
- **Shop Admin** - Inventory stats and product management (when enabled)
- **JWT Authentication** - Secure login with rate limiting

## Quick Start

```bash
# Clone this template
git clone https://github.com/Ammarjeddin/siteTemplate.git my-site
cd my-site

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev

# Open browser
# Site: http://localhost:3000
# Dashboard: http://localhost:3000/dashboard
```

## Project Structure

```
├── content/                 # Content files (JSON)
│   ├── home/               # Homepage content
│   ├── pages/              # Page content (about, contact, etc.)
│   ├── products/           # Product content (when shop enabled)
│   ├── programs/           # Program/service content
│   └── settings/           # Site settings
│       └── site.json
├── docs/                    # Documentation
├── public/                  # Static assets
├── src/
│   ├── app/
│   │   ├── (site)/         # Public pages with shared layout (persistent navbar/footer)
│   │   ├── api/            # API routes (checkout, auth, webhooks)
│   │   ├── dashboard/      # Admin dashboard (separate layout)
│   │   └── login/          # Login page
│   ├── components/
│   │   ├── blocks/         # 17 content block components
│   │   ├── home/           # Homepage layouts
│   │   ├── layout/         # Navbar & Footer variants
│   │   ├── shop/           # Shop components (cart, products)
│   │   └── ui/             # Shared UI components
│   ├── contexts/           # React contexts (Cart, DarkMode)
│   └── lib/                # Utilities and helpers
```

## Customization

### Site Settings

All branding and theme settings are in `content/settings/site.json`:

| Setting | Options |
|---------|---------|
| **Branding** | Site name, logo, tagline |
| **Colors** | Primary, secondary, accent, background, text |
| **Fonts** | 6 pre-configured font pairings |
| **Homepage** | Standard, Hero-Full, Minimal |
| **Navbar** | Floating, Fixed, Transparent |
| **Navbar Button** | Custom text, link, and enable/disable toggle |
| **Footer** | Full, Minimal, Centered |
| **Social** | Facebook, Instagram, Twitter, LinkedIn, YouTube |
| **Analytics** | Google Analytics, Facebook Pixel, Plausible |

### Template Features

Enable or disable features in site settings:

```json
{
  "template": {
    "type": "organization",
    "features": {
      "shop": {
        "enabled": true,
        "currency": "USD",
        "productsPerPage": 12
      },
      "programs": { "enabled": true },
      "events": { "enabled": true }
    }
  }
}
```

### Navigation

Navigation is dynamically generated based on enabled features. When shop is enabled, a "Shop" link automatically appears in the navbar.

## Block Types

| # | Block | Description |
|---|-------|-------------|
| 1 | **Text Block** | Title + paragraph content |
| 2 | **Hero Banner** | Full-width with background image and CTA |
| 3 | **Image + Text (Left)** | Image left, text right |
| 4 | **Image + Text (Right)** | Text left, image right |
| 5 | **Cards Grid** | Grid of icon cards (2-4 columns) |
| 6 | **Call to Action** | Highlighted CTA box |
| 7 | **FAQ / Accordion** | Expandable Q&A |
| 8 | **Image Gallery** | Photo grid with captions |
| 9 | **Contact Info** | Phone, email, address, map |
| 10 | **Stats / Numbers** | Impressive numbers section |
| 11 | **Testimonials** | Customer quotes (grid or carousel) |
| 12 | **Video Embed** | YouTube/Vimeo embed |
| 13 | **Timeline** | Vertical event timeline |
| 14 | **Team Members** | Staff/team grid with bios |
| 15 | **Divider** | Visual separator |
| 16 | **Product Grid** | Display products on any page |
| 17 | **Product Showcase** | Featured product highlight |

## E-Commerce Setup

### Enable Shop Feature

1. Edit `content/settings/site.json`
2. Set `template.features.shop.enabled` to `true`
3. The Shop link will appear in navigation automatically

### Stripe Configuration

Add to your `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Managing Products

1. Go to Dashboard -> Shop
2. Create products with:
   - Name, description, images
   - Pricing (price, compare-at price)
   - Product type (physical, digital, service)
   - Inventory tracking
   - Categories and tags

### Shop Pages

- `/shop` - Product listing with filters
- `/shop/[slug]` - Product detail page
- `/shop/cart` - Shopping cart
- `/shop/checkout` - Stripe checkout redirect
- `/shop/success` - Order confirmation

## Admin Dashboard

Access the admin dashboard at `/dashboard`:

- **Content Management** - Edit pages and site settings
- **Feature Status** - See which features are enabled
- **Shop Admin** - View inventory stats (when shop enabled)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS
- [Stripe](https://stripe.com/) - Payment processing
- [Lucide Icons](https://lucide.dev/) - Icon library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables:
   - `JWT_SECRET` (required for production)
   - `STRIPE_SECRET_KEY` (if shop enabled)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (if shop enabled)
   - `STRIPE_WEBHOOK_SECRET` (if shop enabled)
4. Deploy automatically on every push

### Environment Variables

```env
# Authentication (required for production)
JWT_SECRET=your-secure-secret-key

# Stripe (required if shop enabled)
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Documentation

- [Getting Started](docs/GETTING_STARTED.md) - Installation and setup
- [Customization Guide](docs/CUSTOMIZATION.md) - Theme and layout options
- [Block Types Reference](docs/BLOCKS.md) - All block components
- [Deployment Guide](docs/DEPLOYMENT.md) - Deploy to production

## Demo Pages

The template includes these demo pages:

- `/` - Homepage with hero carousel
- `/about` - About page with timeline and team
- `/programs` - Programs listing
- `/programs/[slug]` - Individual program pages
- `/events` - Events calendar
- `/gallery` - Photo gallery
- `/contact` - Contact form with FAQ
- `/get-involved` - Volunteer and donation info
- `/demo` - Block component showcase
- `/shop` - Product listing (when enabled)
- `/dashboard` - Admin dashboard

## License

MIT

---

Built with Next.js and Stripe
