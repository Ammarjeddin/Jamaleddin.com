# Site Settings Schema

All site settings are editable from the TinaCMS admin dashboard. Settings are stored in `content/settings/site.json`.

## Branding

```typescript
{
  siteName: string;        // "Your Organization"
  tagline: string;         // "Empowering communities..."
  logo: {
    main: string;          // Path to main logo
    icon: string;          // Path to favicon
    light: string;         // Logo for dark backgrounds (optional)
  }
}
```

## Theme Colors

```typescript
{
  theme: {
    primaryColor: string;      // e.g., "#476A7D"
    secondaryColor: string;    // e.g., "#A4C685"
    accentColor: string;       // e.g., "#E8B54D"
    backgroundColor: string;   // e.g., "#E8EDEA"
    textColor: string;         // e.g., "#1a1a1a"
  }
}
```

## Typography / Font Pairings

Available font pairings:

| ID | Heading Font | Body Font |
|----|--------------|-----------|
| modern | Plus Jakarta Sans | Inter |
| classic | Playfair Display | Source Sans Pro |
| clean | Montserrat | Open Sans |
| friendly | Nunito | Lato |
| professional | Raleway | Roboto |
| elegant | Cormorant Garamond | Proza Libre |

```typescript
{
  fonts: {
    pairing: 'modern' | 'classic' | 'clean' | 'friendly' | 'professional' | 'elegant';
  }
}
```

## Layout Options

```typescript
{
  layout: {
    homepage: 'standard' | 'hero-full' | 'minimal';
    navbar: 'floating' | 'fixed' | 'transparent';
    footer: 'full' | 'minimal' | 'centered';
  }
}
```

### Homepage Layouts
- **standard**: Hero carousel (60vh), then content sections
- **hero-full**: Full-screen hero (100vh) with transparent navbar
- **minimal**: Text-based hero, clean whitespace-focused design

### Navbar Styles
- **floating**: Detached with shadow, appears after scroll
- **fixed**: Always visible at top
- **transparent**: Transparent until scroll, then solid

### Footer Styles
- **full**: Logo, navigation, social links, newsletter signup
- **minimal**: Just copyright and essential links
- **centered**: Centered layout with social icons

## Social Media

```typescript
{
  social: {
    facebook: string;   // Full URL or empty
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
  }
}
```

## Analytics

```typescript
{
  analytics: {
    googleAnalyticsId: string;   // e.g., "G-XXXXXXXXXX"
    facebookPixelId: string;
    plausibleDomain: string;
  }
}
```

## SEO Defaults

```typescript
{
  seo: {
    titleTemplate: string;       // e.g., "%s | Your Site Name"
    defaultDescription: string;
    defaultOgImage: string;      // Path to social sharing image
  }
}
```

## Full Example

```json
{
  "siteName": "Horizon Community Foundation",
  "tagline": "Building stronger communities through education and empowerment",
  "logo": {
    "main": "/images/logo.png",
    "icon": "/images/favicon.png",
    "light": "/images/logo-light.png"
  },
  "theme": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#10b981",
    "accentColor": "#f59e0b",
    "backgroundColor": "#f8fafc",
    "textColor": "#1e293b"
  },
  "fonts": {
    "pairing": "modern"
  },
  "layout": {
    "homepage": "standard",
    "navbar": "floating",
    "footer": "full"
  },
  "social": {
    "facebook": "https://facebook.com/horizonfoundation",
    "instagram": "https://instagram.com/horizonfoundation",
    "twitter": "",
    "linkedin": "https://linkedin.com/company/horizonfoundation",
    "youtube": "",
    "tiktok": ""
  },
  "analytics": {
    "googleAnalyticsId": "",
    "facebookPixelId": "",
    "plausibleDomain": ""
  },
  "seo": {
    "titleTemplate": "%s | Horizon Community Foundation",
    "defaultDescription": "Building stronger communities through education, mentorship, and empowerment programs.",
    "defaultOgImage": "/images/og-default.jpg"
  }
}
```
