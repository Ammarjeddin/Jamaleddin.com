# Getting Started

This guide will help you set up and customize your own website using this template.

## Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Git

## Installation

### 1. Clone the Template

```bash
git clone https://github.com/Ammarjeddin/siteTemplate.git my-website
cd my-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## Project Structure

```
my-website/
├── content/                 # Content files (JSON)
│   ├── home/               # Homepage content
│   ├── pages/              # Page content (about, contact, etc.)
│   ├── programs/           # Program/service content
│   └── settings/           # Site settings & theme
├── docs/                    # Documentation
├── public/                  # Static assets (images, fonts)
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/
│   │   ├── blocks/         # 15 reusable content blocks
│   │   ├── home/           # Homepage layouts
│   │   ├── layout/         # Navbar & Footer variants
│   │   ├── providers/      # Context providers
│   │   └── ui/             # Shared UI components
│   └── lib/                # Utilities and helpers
└── tina/                   # TinaCMS configuration
```

## Configuration Files

| File | Purpose |
|------|---------|
| `content/settings/site.json` | Site branding, colors, fonts, layout |
| `content/home/index.json` | Homepage content and hero |
| `src/lib/navigation.ts` | Navigation menu structure |
| `tina/config.ts` | TinaCMS schema configuration |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (local content) |
| `npm run dev:tina` | Start with TinaCMS admin panel |
| `npm run build` | Build for production |
| `npm run build:tina` | Build with TinaCMS |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Quick Customization

### 1. Update Site Settings

Edit `content/settings/site.json`:

```json
{
  "siteName": "Your Organization",
  "tagline": "Your tagline here",
  "theme": {
    "primaryColor": "#476A7D",
    "secondaryColor": "#A4C685",
    "accentColor": "#E8B54D"
  }
}
```

### 2. Update Navigation

Edit `src/lib/navigation.ts`:

```typescript
export const defaultNavigation: NavigationConfig = {
  mainNav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    // Add your pages here
  ],
};
```

### 3. Add Your Logo

Replace files in `public/`:
- `public/images/logo.png` - Main logo
- `public/images/favicon.png` - Favicon

### 4. Update Homepage

Edit `content/home/index.json` to customize:
- Hero section (title, subtitle, images)
- Featured content
- Call-to-action buttons

## Using TinaCMS Admin

For visual editing with TinaCMS:

1. Start with TinaCMS:
   ```bash
   npm run dev:tina
   ```

2. Open admin panel:
   ```
   http://localhost:3000/admin/index.html
   ```

3. Edit content visually and save

### TinaCMS Cloud (Optional)

For team editing and cloud-based content:

1. Create account at [tina.io](https://tina.io)
2. Create a new project
3. Copy your Client ID and Token
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id
   TINA_TOKEN=your-token
   ```

## Adding a New Page

1. Create content file: `content/pages/my-page.json`
   ```json
   {
     "title": "My Page",
     "description": "Page description for SEO",
     "blocks": [
       {
         "_template": "heroBanner",
         "title": "Page Title",
         "subtitle": "Page subtitle"
       }
     ]
   }
   ```

2. Create page route: `src/app/my-page/page.tsx`
   ```tsx
   import { getSiteSettings, getPageContent } from "@/lib/tina";
   import { PageLayout } from "@/components/layout/PageLayout";
   import { BlockRenderer, Block } from "@/components/blocks";
   import { defaultNavigation } from "@/lib/navigation";
   import { notFound } from "next/navigation";

   export default async function MyPage() {
     const { data } = await getSiteSettings();
     const settings = data.siteSettings;
     const content = await getPageContent("my-page");

     if (!content) notFound();

     return (
       <PageLayout settings={settings} navigation={defaultNavigation}>
         <BlockRenderer blocks={(content.blocks || []) as Block[]} />
       </PageLayout>
     );
   }
   ```

3. Add to navigation in `src/lib/navigation.ts`

## Next Steps

- [Customization Guide](./CUSTOMIZATION.md) - Detailed theme and layout options
- [Block Types Reference](./BLOCKS.md) - All 15 block components
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to production

## Common Issues

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Content Not Updating

```bash
# Restart dev server
npm run dev
```

### TypeScript Errors

```bash
# Regenerate types
npm run lint
```

## Support

- [GitHub Issues](https://github.com/Ammarjeddin/siteTemplate/issues)
- [TinaCMS Documentation](https://tina.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
