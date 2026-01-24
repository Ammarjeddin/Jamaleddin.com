# Al Bassem Org: Next.js + TinaCMS Migration Plan

## Executive Summary

**Objective:** Migrate the Al Bassem Organization website from a vanilla JavaScript static site to a modern Next.js application with TinaCMS for visual content editing, keeping all content in Git.

**Current Architecture:**
- 18 HTML pages with dynamic content loading from 10 JSON files
- 1,835-line vanilla JS admin dashboard
- Netlify Functions for backend API
- 15 section templates (text-block, hero-banner, cards-grid, FAQ, etc.)
- Custom CSS design system (~3,716 lines total)

**Target Architecture:**
- Next.js 15+ (App Router) with TypeScript
- TinaCMS for visual editing (Git-based, no database)
- Content stored as Markdown/JSON in GitHub repository
- 15 block components matching current section templates
- Tailwind CSS for styling
- Deployed on Netlify (auto-deploy on Git push)

**Total Estimated Effort:** 50-70 hours

---

## Why TinaCMS + Git Instead of Supabase?

| Aspect | TinaCMS (Git-based) | Supabase (Database) |
|--------|---------------------|---------------------|
| **Content Storage** | Markdown/JSON in Git | PostgreSQL database |
| **Version Control** | Full Git history | Manual backups needed |
| **Deployment** | Push to Git → auto-deploy | API calls → cache invalidation |
| **Admin Dashboard** | Pre-built visual editor | Must build from scratch |
| **Offline Editing** | Works locally | Needs internet |
| **Cost** | Free (self-hosted) or $0-29/mo | Free tier, then $25+/mo |
| **Effort** | 50-70 hours | 120-160 hours |
| **Learning Curve** | Moderate | Higher |

**Your content is always in sync with GitHub** - every edit creates a Git commit.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        EDITOR FLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   TinaCMS Admin (/admin)                                    │
│        │                                                    │
│        ▼                                                    │
│   Visual Editor (live preview)                              │
│        │                                                    │
│        ▼                                                    │
│   Save → Git Commit → Push to GitHub                        │
│        │                                                    │
│        ▼                                                    │
│   Netlify detects push → Rebuilds site → Live!              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      CONTENT STRUCTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   /content                                                  │
│   ├── pages/                  # Dynamic pages with blocks   │
│   │   ├── about-us.md                                       │
│   │   ├── skill-development.md                              │
│   │   └── ...                                               │
│   ├── services.json           # Services data               │
│   ├── initiatives.json        # Initiatives data            │
│   ├── partnerships.json       # Partnerships data           │
│   ├── hero.json               # Hero carousel               │
│   ├── portfolio.json          # Gallery images              │
│   ├── navigation.json         # Menu items                  │
│   ├── contact.json            # Contact info                │
│   └── site-config.json        # Site settings               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## TinaCMS Block Schema (15 Section Types)

Your existing 15 section templates will become TinaCMS blocks:

```typescript
// tina/config.ts

import { defineConfig, Template } from 'tinacms';

// Block Templates (matching your section-templates.json)

const textBlock: Template = {
  name: 'textBlock',
  label: 'Text Block',
  ui: { itemProps: (item) => ({ label: item.title }) },
  fields: [
    { type: 'string', name: 'title', label: 'Title', required: true },
    { type: 'rich-text', name: 'content', label: 'Content', required: true },
  ],
};

const heroBanner: Template = {
  name: 'heroBanner',
  label: 'Hero Banner',
  fields: [
    { type: 'string', name: 'title', label: 'Title', required: true },
    { type: 'string', name: 'subtitle', label: 'Subtitle' },
    { type: 'image', name: 'backgroundImage', label: 'Background Image' },
    { type: 'string', name: 'buttonText', label: 'Button Text' },
    { type: 'string', name: 'buttonLink', label: 'Button Link' },
  ],
};

const imageTextLeft: Template = {
  name: 'imageTextLeft',
  label: 'Image + Text (Image Left)',
  fields: [
    { type: 'string', name: 'title', label: 'Title', required: true },
    { type: 'rich-text', name: 'content', label: 'Content', required: true },
    { type: 'image', name: 'image', label: 'Image', required: true },
  ],
};

const imageTextRight: Template = {
  name: 'imageTextRight',
  label: 'Image + Text (Image Right)',
  fields: [
    { type: 'string', name: 'title', label: 'Title', required: true },
    { type: 'rich-text', name: 'content', label: 'Content', required: true },
    { type: 'image', name: 'image', label: 'Image', required: true },
  ],
};

const cardsGrid: Template = {
  name: 'cardsGrid',
  label: 'Cards Grid',
  fields: [
    { type: 'string', name: 'title', label: 'Section Title' },
    {
      type: 'object',
      name: 'cards',
      label: 'Cards',
      list: true,
      fields: [
        { type: 'string', name: 'icon', label: 'Icon (Lucide name)' },
        { type: 'string', name: 'title', label: 'Title', required: true },
        { type: 'string', name: 'description', label: 'Description' },
      ],
    },
  ],
};

const ctaBox: Template = {
  name: 'ctaBox',
  label: 'Call to Action',
  fields: [
    { type: 'string', name: 'title', label: 'Title', required: true },
    { type: 'string', name: 'content', label: 'Description', ui: { component: 'textarea' } },
    { type: 'string', name: 'buttonText', label: 'Button Text', required: true },
    { type: 'string', name: 'buttonLink', label: 'Button Link', required: true },
    { 
      type: 'string', 
      name: 'style', 
      label: 'Style',
      options: ['primary', 'secondary', 'accent'],
    },
  ],
};

const faq: Template = {
  name: 'faq',
  label: 'FAQ / Accordion',
  fields: [
    { type: 'string', name: 'title', label: 'Section Title' },
    {
      type: 'object',
      name: 'items',
      label: 'FAQ Items',
      list: true,
      fields: [
        { type: 'string', name: 'question', label: 'Question', required: true },
        { type: 'string', name: 'answer', label: 'Answer', required: true, ui: { component: 'textarea' } },
      ],
    },
  ],
};

const imageGallery: Template = {
  name: 'imageGallery',
  label: 'Image Gallery',
  fields: [
    { type: 'string', name: 'title', label: 'Gallery Title' },
    {
      type: 'object',
      name: 'images',
      label: 'Images',
      list: true,
      fields: [
        { type: 'image', name: 'src', label: 'Image', required: true },
        { type: 'string', name: 'alt', label: 'Alt Text' },
        { type: 'string', name: 'caption', label: 'Caption' },
      ],
    },
  ],
};

const contactInfo: Template = {
  name: 'contactInfo',
  label: 'Contact Information',
  fields: [
    { type: 'string', name: 'title', label: 'Title' },
    { type: 'boolean', name: 'showPhone', label: 'Show Phone' },
    { type: 'boolean', name: 'showEmail', label: 'Show Email' },
    { type: 'boolean', name: 'showAddress', label: 'Show Address' },
    { type: 'string', name: 'additionalInfo', label: 'Additional Info', ui: { component: 'textarea' } },
  ],
};

const stats: Template = {
  name: 'stats',
  label: 'Stats / Numbers',
  fields: [
    { type: 'string', name: 'title', label: 'Section Title' },
    {
      type: 'object',
      name: 'stats',
      label: 'Statistics',
      list: true,
      fields: [
        { type: 'string', name: 'number', label: 'Number', required: true },
        { type: 'string', name: 'label', label: 'Label', required: true },
      ],
    },
  ],
};

const testimonials: Template = {
  name: 'testimonials',
  label: 'Testimonials',
  fields: [
    { type: 'string', name: 'title', label: 'Section Title' },
    {
      type: 'object',
      name: 'testimonials',
      label: 'Testimonials',
      list: true,
      fields: [
        { type: 'string', name: 'quote', label: 'Quote', required: true, ui: { component: 'textarea' } },
        { type: 'string', name: 'author', label: 'Author', required: true },
        { type: 'string', name: 'role', label: 'Role' },
        { type: 'image', name: 'avatar', label: 'Avatar' },
      ],
    },
  ],
};

const video: Template = {
  name: 'video',
  label: 'Video Embed',
  fields: [
    { type: 'string', name: 'title', label: 'Title' },
    { type: 'string', name: 'videoUrl', label: 'Video URL (YouTube/Vimeo)', required: true },
    { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
  ],
};

const timeline: Template = {
  name: 'timeline',
  label: 'Timeline',
  fields: [
    { type: 'string', name: 'title', label: 'Section Title' },
    {
      type: 'object',
      name: 'events',
      label: 'Timeline Events',
      list: true,
      fields: [
        { type: 'string', name: 'year', label: 'Year', required: true },
        { type: 'string', name: 'title', label: 'Title', required: true },
        { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
      ],
    },
  ],
};

const team: Template = {
  name: 'team',
  label: 'Team Members',
  fields: [
    { type: 'string', name: 'title', label: 'Section Title' },
    {
      type: 'object',
      name: 'members',
      label: 'Team Members',
      list: true,
      fields: [
        { type: 'string', name: 'name', label: 'Name', required: true },
        { type: 'string', name: 'role', label: 'Role' },
        { type: 'image', name: 'image', label: 'Photo' },
        { type: 'string', name: 'bio', label: 'Bio', ui: { component: 'textarea' } },
      ],
    },
  ],
};

const divider: Template = {
  name: 'divider',
  label: 'Divider / Spacer',
  fields: [
    { 
      type: 'string', 
      name: 'style', 
      label: 'Style',
      options: ['line', 'dots', 'space'],
    },
    { 
      type: 'string', 
      name: 'spacing', 
      label: 'Spacing',
      options: ['small', 'medium', 'large'],
    },
  ],
};

// Export all blocks
export const allBlocks = [
  textBlock,
  heroBanner,
  imageTextLeft,
  imageTextRight,
  cardsGrid,
  ctaBox,
  faq,
  imageGallery,
  contactInfo,
  stats,
  testimonials,
  video,
  timeline,
  team,
  divider,
];
```

---

## Directory Structure

```
albassem-nextjs/
├── app/
│   ├── (public)/                    # Public site
│   │   ├── layout.tsx               # Public layout (nav, footer)
│   │   ├── page.tsx                 # Homepage
│   │   ├── [slug]/
│   │   │   ├── page.tsx             # Dynamic pages (SSG)
│   │   │   └── client-page.tsx      # Client component for live editing
│   │   └── gallery/
│   │       └── page.tsx
│   │
│   ├── admin/
│   │   └── [[...filename]]/
│   │       └── page.tsx             # TinaCMS admin (auto-generated)
│   │
│   ├── api/
│   │   └── tina/
│   │       └── [...routes].ts       # TinaCMS API routes
│   │
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   │
│   ├── blocks/                      # 15 block components
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
│   │   └── BlockRenderer.tsx        # Switch component to render blocks
│   │
│   ├── home/
│   │   ├── HeroCarousel.tsx
│   │   ├── ServicesGrid.tsx
│   │   ├── InitiativesGrid.tsx
│   │   ├── PartnershipsGrid.tsx
│   │   └── PortfolioGrid.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Icon.tsx
│
├── content/                         # Content (Git-tracked)
│   ├── pages/                       # Markdown files with blocks
│   │   ├── about-us.md
│   │   ├── skill-development.md
│   │   ├── career-coaching.md
│   │   └── ...
│   ├── home.json                    # Homepage configuration
│   ├── services.json
│   ├── initiatives.json
│   ├── partnerships.json
│   ├── hero.json
│   ├── portfolio.json
│   ├── navigation.json
│   ├── contact.json
│   └── site-config.json
│
├── tina/
│   ├── config.ts                    # TinaCMS configuration
│   └── __generated__/               # Auto-generated types
│
├── public/
│   ├── main_assets/
│   │   ├── LOGO_MAIN.png
│   │   └── LOGO_NAME.png
│   └── images/
│
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Implementation Phases

### Phase 1: Foundation (8-10 hours)

**Objective:** Set up Next.js with TinaCMS

**Tasks:**
1. Create new Next.js 15 project with App Router and TypeScript
2. Install and configure TinaCMS (`npx @tinacms/cli@latest init`)
3. Set up Tailwind CSS
4. Create basic layout components (Navbar, Footer)
5. Configure environment variables

**Commands:**
```bash
# Create Next.js project
npx create-next-app@latest albassem-nextjs --typescript --tailwind --app

# Install TinaCMS
cd albassem-nextjs
npx @tinacms/cli@latest init

# Install additional dependencies
npm install lucide-react
```

**Deliverables:**
- Working Next.js project with TinaCMS
- Basic layout visible at localhost:3000
- TinaCMS admin accessible at localhost:3000/admin

---

### Phase 2: Block Components (12-15 hours)

**Objective:** Create React components for all 15 section types

**Tasks:**
1. Create `BlockRenderer.tsx` - switch component for rendering blocks
2. Build 15 block components matching `section-templates.json`:
   - TextBlock, HeroBanner, ImageTextLeft, ImageTextRight
   - CardsGrid, CtaBox, Faq, ImageGallery
   - ContactInfo, Stats, Testimonials, Video
   - Timeline, Team, Divider
3. Style blocks with Tailwind CSS (port existing CSS)
4. Add Lucide icons integration

**Example BlockRenderer:**
```typescript
// components/blocks/BlockRenderer.tsx
import { TextBlock } from './TextBlock';
import { HeroBanner } from './HeroBanner';
import { CardsGrid } from './CardsGrid';
// ... import all blocks

type Block = {
  __typename: string;
  [key: string]: any;
};

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks?.map((block, index) => {
        switch (block.__typename) {
          case 'PageBlocksTextBlock':
            return <TextBlock key={index} {...block} />;
          case 'PageBlocksHeroBanner':
            return <HeroBanner key={index} {...block} />;
          case 'PageBlocksCardsGrid':
            return <CardsGrid key={index} {...block} />;
          // ... all 15 block types
          default:
            return null;
        }
      })}
    </>
  );
}
```

**Deliverables:**
- All 15 block components built and styled
- BlockRenderer working correctly
- Visual parity with current site

---

### Phase 3: Content Migration (8-10 hours)

**Objective:** Migrate all JSON content to TinaCMS format

**Tasks:**
1. Define TinaCMS collections in `tina/config.ts`:
   - Pages collection (with blocks)
   - Services collection
   - Initiatives collection
   - Partnerships collection
   - Hero collection
   - Portfolio collection
   - Navigation collection
   - Contact collection (singleton)
   - Site Config collection (singleton)

2. Convert existing JSON files to TinaCMS content structure:
   - Move `data/pages.json` → `content/pages/*.md` (with frontmatter blocks)
   - Keep other JSON files as TinaCMS JSON collections

3. Write migration script to transform data

**TinaCMS Collections Config:**
```typescript
// tina/config.ts
export default defineConfig({
  // ...
  schema: {
    collections: [
      // Pages with blocks
      {
        name: 'page',
        label: 'Pages',
        path: 'content/pages',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          { type: 'string', name: 'slug', label: 'Slug', required: true },
          { type: 'boolean', name: 'showInNav', label: 'Show in Navigation' },
          { type: 'number', name: 'order', label: 'Display Order' },
          { type: 'boolean', name: 'active', label: 'Active' },
          {
            type: 'object',
            name: 'blocks',
            label: 'Content Blocks',
            list: true,
            templates: allBlocks, // All 15 block templates
          },
        ],
      },
      // Services
      {
        name: 'services',
        label: 'Services',
        path: 'content',
        format: 'json',
        match: { include: 'services' },
        fields: [
          {
            type: 'object',
            name: 'items',
            label: 'Services',
            list: true,
            fields: [
              { type: 'string', name: 'title', label: 'Title', required: true },
              { type: 'string', name: 'description', label: 'Description' },
              { type: 'string', name: 'iconUrl', label: 'Icon (Lucide name)' },
              { type: 'image', name: 'imageUrl', label: 'Image' },
              { type: 'string', name: 'slug', label: 'Slug' },
              { type: 'string', name: 'linkType', label: 'Link Type', options: ['internal', 'external'] },
              { type: 'number', name: 'order', label: 'Order' },
              { type: 'boolean', name: 'active', label: 'Active' },
            ],
          },
        ],
      },
      // ... similar for initiatives, partnerships, hero, portfolio, navigation
      
      // Contact (singleton)
      {
        name: 'contact',
        label: 'Contact Info',
        path: 'content',
        format: 'json',
        match: { include: 'contact' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'phone', label: 'Phone' },
          { type: 'string', name: 'email', label: 'Email' },
          { type: 'string', name: 'address', label: 'Address' },
        ],
      },
    ],
  },
});
```

**Deliverables:**
- All content migrated to TinaCMS format
- TinaCMS admin shows all collections
- Content editable through visual editor

---

### Phase 4: Pages & Homepage (10-12 hours)

**Objective:** Build all public-facing pages with SSG

**Tasks:**
1. Build homepage with all sections:
   - Hero carousel
   - About section
   - Services grid
   - Initiatives
   - Partnerships
   - Portfolio gallery
   - Contact form

2. Build dynamic page route (`app/[slug]/page.tsx`)
3. Implement SSG with `generateStaticParams`
4. Add SEO metadata
5. Create 404 page

**Dynamic Page Example:**
```typescript
// app/(public)/[slug]/page.tsx
import { client } from '@/tina/__generated__/client';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

export async function generateStaticParams() {
  const pages = await client.queries.pageConnection();
  return pages.data?.pageConnection?.edges?.map((edge) => ({
    slug: edge?.node?.slug,
  })) || [];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { data } = await client.queries.page({ relativePath: `${params.slug}.md` });
  
  return (
    <main>
      <h1>{data.page.title}</h1>
      <BlockRenderer blocks={data.page.blocks} />
    </main>
  );
}
```

**Deliverables:**
- Homepage fully functional
- All 13 dynamic pages rendering
- SEO metadata on all pages
- Mobile responsive

---

### Phase 5: Polish & Deploy (8-10 hours)

**Objective:** Testing, optimization, and deployment

**Tasks:**
1. Cross-browser testing (Chrome, Firefox, Safari)
2. Mobile responsiveness testing
3. Performance optimization (images, fonts)
4. Lighthouse audits (target: 90+ scores)
5. Configure Netlify deployment
6. Set up TinaCMS Cloud (optional - for non-local editing)
7. Documentation for content editors

**Netlify Configuration:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Deliverables:**
- Site deployed to Netlify
- TinaCMS admin working in production
- Content editor documentation
- All tests passing

---

## Timeline Summary

| Phase | Description | Hours |
|-------|-------------|-------|
| 1 | Foundation (Next.js + TinaCMS setup) | 8-10 |
| 2 | Block Components (15 section types) | 12-15 |
| 3 | Content Migration | 8-10 |
| 4 | Pages & Homepage | 10-12 |
| 5 | Polish & Deploy | 8-10 |
| **Total** | | **46-57 hours** |

**Buffer (20%):** 10-13 hours
**Total with buffer:** **56-70 hours**

---

## Benefits of This Approach

1. **Content always in Git** - Every edit creates a commit, full version history
2. **No database to manage** - Simpler architecture, no ongoing costs
3. **Visual editing** - TinaCMS provides inline editing experience
4. **Automatic deployments** - Push to GitHub → Netlify rebuilds automatically
5. **15 block types** - Flexible page building with all your section types
6. **Type safety** - TinaCMS generates TypeScript types from your schema
7. **Faster development** - 50-70 hours vs 120-160 hours with Supabase
8. **SEO optimized** - Static generation with Next.js

---

## Comparison: Old Plan vs New Plan

| Aspect | Supabase Plan | TinaCMS Plan |
|--------|---------------|--------------|
| **Effort** | 120-160 hours | 50-70 hours |
| **Admin Dashboard** | Build from scratch (24-30 hrs) | Pre-built (0 hrs) |
| **Database** | PostgreSQL (10 tables) | None (Git-based) |
| **Content Storage** | Database rows | Markdown/JSON files |
| **Version Control** | Manual backups | Full Git history |
| **Monthly Cost** | $0-25+ (Supabase) | $0-29 (TinaCMS Cloud optional) |
| **Complexity** | High | Medium |
| **Section Types** | 14+ (build UI) | 15 (block templates) |

---

## Next Steps

1. **Create new Next.js project** in a separate directory
2. **Initialize TinaCMS** with the CLI
3. **Port CSS to Tailwind** (or keep custom CSS)
4. **Build block components** one at a time
5. **Migrate content** from current JSON files
6. **Deploy to Netlify** with auto-deploy from GitHub

---

## Resources

- [TinaCMS Documentation](https://tina.io/docs)
- [TinaCMS + Next.js App Router](https://tina.io/docs/frameworks/next/app-router)
- [TinaCMS Blocks](https://tina.io/docs/editing/blocks)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
