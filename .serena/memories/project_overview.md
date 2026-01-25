# Site Template - Project Overview

## Purpose
A reusable, white-label website template built with Next.js 15+ and TinaCMS. Designed to be forked/cloned and customized for any organization in minutes through the admin dashboard.

## Tech Stack
- **Framework**: Next.js 16+ (App Router)
- **CMS**: Custom Admin Dashboard (Git-based content)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide Icons
- **Language**: TypeScript
- **Hosting**: Netlify (auto-deploy from Git)
- **E-commerce**: Stripe integration for shop

## Dark Mode
- Uses `useDarkMode()` hook from `@/contexts/DarkModeContext`
- **Important**: Tailwind `dark:` classes have specificity issues in this project
- **Solution**: Use inline styles with `isDarkMode` state for reliable dark mode:
  ```tsx
  const { isDarkMode } = useDarkMode();
  const textStyle = { color: isDarkMode ? "#ffffff" : "#374151" };
  ```
- Components using dark mode must have `"use client"` directive

## Key Features

### Admin-Editable Settings
All customization from the TinaCMS admin dashboard:
- Site name, logo, tagline
- Theme colors (primary, secondary, accent, background, text)
- Font pairings (6 pre-configured options)
- Layout variants (homepage, navbar, footer styles)
- Social media links
- Analytics (GA, Facebook Pixel)
- SEO defaults

### Layout Variants
- **Homepage**: Standard, Hero-Full, Minimal
- **Navbar**: Floating, Fixed, Transparent
- **Footer**: Full, Minimal, Centered

### 17 Block/Section Types
1. Text Block
2. Hero Banner
3. Image + Text (Left)
4. Image + Text (Right)
5. Cards Grid
6. Call to Action
7. FAQ / Accordion
8. Image Gallery
9. Contact Info
10. Stats / Numbers
11. Testimonials
12. Video Embed
13. Timeline
14. Team Members
15. Divider / Spacer
16. Product Grid
17. Product Showcase

### Shop Feature
- Product listings with categories and filters
- Cart functionality with CartContext
- Stripe checkout integration
- Product detail pages

### Navigation
- Floating navbar (always island style with rounded corners)
- Custom navigation management in settings
- Dropdown support for nested navigation items
- Dark mode toggle in navbar
- Active page indicator with pill-shaped background

## Demo Content
Template includes realistic demo content for "Horizon Community Foundation" - a fictional non-profit organization.

## Origin
This template was extracted from the Al Bassem Organization website project (bassemOrg). The Al Bassem site will be rebuilt using this template as the first real implementation.

## Related Files
- `TEMPLATE_PLAN.md` - Detailed implementation plan
- `MIGRATION_PLAN.md` - Technical Next.js + TinaCMS setup details
- `section-templates.json` - Block type definitions from original project
