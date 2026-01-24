# Next.js + TinaCMS Website Template

A reusable, white-label website template with visual editing. Customize branding, colors, fonts, and layouts directly from the admin dashboard.

## Features

- **15 Block Types** - Text, Hero, Cards, FAQ, Gallery, Stats, Testimonials, Timeline, Team, and more
- **Visual Editing** - TinaCMS provides live preview editing
- **Git-Based Content** - All content stored in your repository
- **Theme Customization** - Colors, fonts, layouts editable from admin
- **Layout Variants** - Multiple navbar, footer, and homepage options
- **SEO Optimized** - Static generation with Next.js
- **Responsive** - Mobile-first design with Tailwind CSS

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
# Admin: http://localhost:3000/admin/index.html
```

## Customization

All settings are editable from the admin dashboard at `/admin`:

| Setting | Options |
|---------|---------|
| **Branding** | Site name, logo, tagline |
| **Colors** | Primary, secondary, accent, background, text |
| **Fonts** | 6 pre-configured font pairings |
| **Homepage** | Standard, Hero-Full, Minimal |
| **Navbar** | Floating, Fixed, Transparent |
| **Footer** | Full, Minimal, Centered |
| **Social** | Facebook, Instagram, Twitter, LinkedIn, YouTube |
| **Analytics** | Google Analytics, Facebook Pixel |

## Block Types

1. **Text Block** - Title + paragraph content
2. **Hero Banner** - Full-width with background image and CTA
3. **Image + Text (Left)** - Image left, text right
4. **Image + Text (Right)** - Text left, image right
5. **Cards Grid** - Grid of icon cards
6. **Call to Action** - Highlighted CTA box
7. **FAQ / Accordion** - Expandable Q&A
8. **Image Gallery** - Photo grid with captions
9. **Contact Info** - Phone, email, address display
10. **Stats / Numbers** - Impressive numbers section
11. **Testimonials** - Customer quotes
12. **Video Embed** - YouTube/Vimeo embed
13. **Timeline** - Vertical event timeline
14. **Team Members** - Staff/team grid
15. **Divider** - Visual separator

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [TinaCMS](https://tina.io/) - Git-based headless CMS
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide Icons](https://lucide.dev/) - Icon library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages
│   ├── admin/             # TinaCMS admin
│   └── api/               # API routes
├── components/
│   ├── blocks/            # 15 block components
│   ├── layout/            # Navbar, Footer variants
│   └── ui/                # Shared UI components
├── content/               # Content (Git-tracked)
│   ├── pages/             # Page content (Markdown)
│   └── settings/          # Site settings (JSON)
├── tina/                  # TinaCMS configuration
└── public/                # Static assets
```

## Deployment

### Netlify

1. Connect your GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Auto-deploys on every push

### Vercel

1. Import your GitHub repo to Vercel
2. Framework preset: Next.js (auto-detected)
3. Auto-deploys on every push

## Documentation

- [Getting Started](docs/GETTING_STARTED.md)
- [Customization Guide](docs/CUSTOMIZATION.md)
- [Block Types Reference](docs/BLOCKS.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## License

MIT

---

Built with ❤️ using Next.js and TinaCMS
