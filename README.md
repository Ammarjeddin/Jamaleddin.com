# Next.js + TinaCMS Website Template

A reusable, white-label website template with visual editing capabilities. Customize branding, colors, fonts, and layouts directly from the admin dashboard or content files.

## Demo

This template includes a complete demo site for "Horizon Community Foundation" - a fictional nonprofit organization showcasing all features and block types.

## Features

- **15 Block Types** - Text, Hero, Cards, FAQ, Gallery, Stats, Testimonials, Timeline, Team, and more
- **Visual Editing** - TinaCMS provides live preview editing
- **Git-Based Content** - All content stored as JSON in your repository
- **Theme Customization** - Colors, fonts, layouts editable from settings
- **Layout Variants** - Multiple navbar (3), footer (3), and homepage (3) options
- **SEO Optimized** - Static generation with Next.js 15
- **Responsive** - Mobile-first design with Tailwind CSS 4
- **TypeScript** - Full type safety throughout

## Quick Start

```bash
# Clone this template
git clone https://github.com/Ammarjeddin/siteTemplate.git my-site
cd my-site

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Site: http://localhost:3000
# Admin: http://localhost:3000/admin/index.html (requires TinaCMS setup)
```

## Project Structure

```
├── content/                 # Content files (JSON)
│   ├── home/               # Homepage content
│   │   └── index.json
│   ├── pages/              # Page content
│   │   ├── about.json
│   │   ├── contact.json
│   │   ├── events.json
│   │   ├── gallery.json
│   │   └── get-involved.json
│   ├── programs/           # Program/service content
│   │   ├── adult-education.json
│   │   ├── community-wellness.json
│   │   ├── digital-skills.json
│   │   └── youth-leadership.json
│   └── settings/           # Site settings
│       └── site.json
├── docs/                    # Documentation
├── public/                  # Static assets
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/
│   │   ├── blocks/         # 15 content block components
│   │   ├── home/           # Homepage layouts
│   │   ├── layout/         # Navbar & Footer variants
│   │   ├── providers/      # Context providers (Theme)
│   │   └── ui/             # Shared UI components
│   └── lib/                # Utilities and helpers
└── tina/                   # TinaCMS configuration
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
| **Footer** | Full, Minimal, Centered |
| **Social** | Facebook, Instagram, Twitter, LinkedIn, YouTube, TikTok |
| **Analytics** | Google Analytics, Facebook Pixel, Plausible |

### Navigation

Edit `src/lib/navigation.ts` to update menu items:

```typescript
export const defaultNavigation = {
  mainNav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Programs", href: "/programs", children: [...] },
    { label: "Contact", href: "/contact" },
  ],
  ctaButton: { label: "Donate", href: "/donate" },
};
```

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

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:tina` | Start with TinaCMS admin |
| `npm run build` | Build for production |
| `npm run build:tina` | Build with TinaCMS |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TinaCMS](https://tina.io/) - Git-based headless CMS
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS
- [Lucide Icons](https://lucide.dev/) - Icon library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import to [Vercel](https://vercel.com)
3. Framework preset: Next.js (auto-detected)
4. Deploy automatically on every push

### Netlify

1. Push your repository to GitHub
2. Import to [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`

### Environment Variables (for TinaCMS Cloud)

```
NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id
TINA_TOKEN=your-token
```

## Documentation

- [Getting Started](docs/GETTING_STARTED.md) - Installation and setup
- [Customization Guide](docs/CUSTOMIZATION.md) - Theme and layout options
- [Block Types Reference](docs/BLOCKS.md) - All 15 block components
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

## License

MIT

---

Built with Next.js and TinaCMS
