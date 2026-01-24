# Customization Guide

This guide covers all customization options available in the template.

## Table of Contents

- [Theme System](#theme-system)
- [Colors](#colors)
- [Fonts](#fonts)
- [Layout Options](#layout-options)
- [Navigation](#navigation)
- [Social Links](#social-links)
- [Analytics](#analytics)

---

## Theme System

The template uses CSS custom properties (variables) that are dynamically generated from your site settings. This allows real-time theme changes from the admin dashboard.

### How It Works

1. Settings are stored in `content/settings/site.json`
2. `ThemeProvider` component reads settings and injects CSS variables
3. All components use these CSS variables for styling

### CSS Variables Available

```css
/* Colors */
--color-primary          /* Primary brand color */
--color-primary-dark     /* Darker shade (auto-generated) */
--color-secondary        /* Secondary brand color */
--color-accent          /* Accent/highlight color */
--color-background      /* Page background */
--color-text            /* Main text color */
--color-text-muted      /* Muted/secondary text */

/* Fonts */
--font-heading          /* Heading font family */
--font-body             /* Body text font family */
```

---

## Colors

### Setting Colors

Edit `content/settings/site.json`:

```json
{
  "theme": {
    "primaryColor": "#476A7D",
    "secondaryColor": "#A4C685",
    "accentColor": "#E8B54D",
    "backgroundColor": "#E8EDEA",
    "textColor": "#1a1a1a"
  }
}
```

### Color Guidelines

| Color | Usage |
|-------|-------|
| **Primary** | Headers, buttons, links, accents |
| **Secondary** | Secondary buttons, highlights |
| **Accent** | Call-to-action, important elements |
| **Background** | Page background |
| **Text** | Body text, headings |

### Using Colors in Components

```tsx
// In Tailwind CSS classes
<div className="bg-[var(--color-primary)]">
  <h1 className="text-[var(--color-text)]">Title</h1>
</div>

// For hover states
<button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]">
  Click me
</button>
```

---

## Fonts

### Available Font Pairings

The template includes 6 pre-configured font pairings:

| ID | Heading Font | Body Font |
|----|--------------|-----------|
| `modern` | Plus Jakarta Sans | Inter |
| `classic` | Playfair Display | Source Sans Pro |
| `geometric` | Poppins | Open Sans |
| `elegant` | Cormorant Garamond | Lato |
| `clean` | DM Sans | Work Sans |
| `bold` | Montserrat | Nunito |

### Setting Fonts

Edit `content/settings/site.json`:

```json
{
  "fonts": {
    "pairing": "modern"
  }
}
```

Or specify custom fonts:

```json
{
  "fonts": {
    "heading": "Plus Jakarta Sans",
    "body": "Inter"
  }
}
```

### Adding Custom Fonts

1. Add font import to `src/app/layout.tsx`
2. Update font configuration in `src/lib/fonts.ts`
3. Set font in site settings

---

## Layout Options

### Homepage Layouts

Three homepage layouts are available:

#### Standard Layout
```json
{ "layout": { "homepage": "standard" } }
```
- Full hero section with carousel
- Featured content sections
- Traditional website layout

#### Hero-Full Layout
```json
{ "layout": { "homepage": "hero-full" } }
```
- Full-screen hero image
- Overlay text and CTA
- Scrolling content below

#### Minimal Layout
```json
{ "layout": { "homepage": "minimal" } }
```
- Clean, simple design
- Text-focused hero
- Reduced visual elements

### Navbar Variants

#### Floating Navbar (Default)
```json
{ "layout": { "navbar": "floating" } }
```
- Rounded corners with shadow
- Slightly inset from edges
- Modern, floating appearance

#### Fixed Navbar
```json
{ "layout": { "navbar": "fixed" } }
```
- Fixed to top of page
- Full-width
- Solid background

#### Transparent Navbar
```json
{ "layout": { "navbar": "transparent" } }
```
- Transparent background
- White text (for dark hero images)
- Becomes solid on scroll

### Footer Variants

#### Full Footer (Default)
```json
{ "layout": { "footer": "full" } }
```
- Multiple columns
- Navigation links
- Social icons
- Contact info

#### Minimal Footer
```json
{ "layout": { "footer": "minimal" } }
```
- Single row
- Copyright and essential links
- Social icons

#### Centered Footer
```json
{ "layout": { "footer": "centered" } }
```
- Center-aligned
- Logo and tagline
- Social icons
- Copyright

---

## Navigation

### Structure

Edit `src/lib/navigation.ts`:

```typescript
export const defaultNavigation: NavigationConfig = {
  mainNav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    {
      label: "Programs",
      href: "/programs",
      children: [
        { label: "Youth Leadership", href: "/programs/youth-leadership" },
        { label: "Adult Education", href: "/programs/adult-education" },
      ],
    },
    { label: "Contact", href: "/contact" },
  ],
  ctaButton: {
    label: "Donate",
    href: "/donate",
  },
};
```

### Navigation Item Options

```typescript
interface NavItem {
  label: string;      // Display text
  href: string;       // Link URL
  children?: NavItem[]; // Dropdown items (optional)
}
```

### CTA Button

The optional CTA button appears as a highlighted button in the navbar:

```typescript
ctaButton: {
  label: "Get Started",
  href: "/contact",
}
```

---

## Social Links

### Available Platforms

```json
{
  "social": {
    "facebook": "https://facebook.com/yourpage",
    "instagram": "https://instagram.com/yourhandle",
    "twitter": "https://twitter.com/yourhandle",
    "linkedin": "https://linkedin.com/company/yourcompany",
    "youtube": "https://youtube.com/yourchannel"
  }
}
```

### Where They Appear

- Footer (all variants)
- Contact page
- Mobile menu

Leave empty to hide a platform:
```json
{
  "social": {
    "facebook": "",  // Hidden
    "instagram": "https://instagram.com/yourhandle"  // Shown
  }
}
```

---

## Analytics

### Google Analytics

```json
{
  "analytics": {
    "googleAnalyticsId": "G-XXXXXXXXXX"
  }
}
```

### Facebook Pixel

```json
{
  "analytics": {
    "facebookPixelId": "1234567890"
  }
}
```

### Implementation

Analytics scripts are automatically added when IDs are provided. No additional configuration needed.

---

## Advanced Customization

### Custom CSS

Add custom styles in `src/app/globals.css`:

```css
/* Custom overrides */
.custom-class {
  /* Your styles */
}
```

### Component Overrides

To modify a component:

1. Find the component in `src/components/`
2. Make your changes
3. Test thoroughly

### Adding New Block Types

See [Block Types Reference](./BLOCKS.md) for instructions on creating custom blocks.

---

## Best Practices

1. **Colors**: Ensure sufficient contrast for accessibility
2. **Fonts**: Limit to 2 font families for performance
3. **Images**: Optimize images before uploading
4. **Navigation**: Keep menu items to 5-7 for usability
5. **Mobile**: Always test on mobile devices

---

## Need Help?

- [Getting Started](./GETTING_STARTED.md)
- [Block Types Reference](./BLOCKS.md)
- [Deployment Guide](./DEPLOYMENT.md)
