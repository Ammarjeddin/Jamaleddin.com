# Block Types Reference

This template includes 15 reusable content blocks. Each block can be added to any page through the content JSON files or TinaCMS admin.

## Table of Contents

1. [Text Block](#1-text-block)
2. [Hero Banner](#2-hero-banner)
3. [Image + Text (Left)](#3-image--text-left)
4. [Image + Text (Right)](#4-image--text-right)
5. [Cards Grid](#5-cards-grid)
6. [Call to Action](#6-call-to-action)
7. [FAQ / Accordion](#7-faq--accordion)
8. [Image Gallery](#8-image-gallery)
9. [Contact Info](#9-contact-info)
10. [Stats / Numbers](#10-stats--numbers)
11. [Testimonials](#11-testimonials)
12. [Video Embed](#12-video-embed)
13. [Timeline](#13-timeline)
14. [Team Members](#14-team-members)
15. [Divider](#15-divider)

---

## 1. Text Block

Simple title and paragraph content.

```json
{
  "_template": "textBlock",
  "title": "Section Title",
  "body": "Your paragraph content here. Supports multiple paragraphs.",
  "alignment": "left"
}
```

### Options

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `title` | string | - | - |
| `body` | string | - | - |
| `alignment` | string | `left`, `center`, `right` | `left` |

---

## 2. Hero Banner

Full-width hero section with background image and CTA.

```json
{
  "_template": "heroBanner",
  "title": "Welcome to Our Site",
  "subtitle": "Empowering communities through innovation",
  "backgroundImage": "/images/hero.jpg",
  "ctaText": "Get Started",
  "ctaLink": "/contact",
  "overlay": true
}
```

### Options

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `title` | string | - | - |
| `subtitle` | string | - | - |
| `backgroundImage` | string | Image URL | - |
| `ctaText` | string | - | - |
| `ctaLink` | string | URL | - |
| `overlay` | boolean | - | `true` |

---

## 3. Image + Text (Left)

Image on left, text content on right.

```json
{
  "_template": "imageTextLeft",
  "image": "/images/feature.jpg",
  "imageAlt": "Feature description",
  "title": "Our Mission",
  "body": "Description text here...",
  "ctaText": "Learn More",
  "ctaLink": "/about"
}
```

### Options

| Property | Type | Required |
|----------|------|----------|
| `image` | string | Yes |
| `imageAlt` | string | Yes |
| `title` | string | Yes |
| `body` | string | Yes |
| `ctaText` | string | No |
| `ctaLink` | string | No |

---

## 4. Image + Text (Right)

Text content on left, image on right.

```json
{
  "_template": "imageTextRight",
  "image": "/images/feature.jpg",
  "imageAlt": "Feature description",
  "title": "Our Vision",
  "body": "Description text here...",
  "ctaText": "Discover More",
  "ctaLink": "/vision"
}
```

### Options

Same as Image + Text (Left).

---

## 5. Cards Grid

Grid of cards with icons.

```json
{
  "_template": "cardsGrid",
  "title": "Our Services",
  "subtitle": "What we offer",
  "columns": 3,
  "cards": [
    {
      "icon": "users",
      "title": "Community",
      "description": "Building stronger communities together."
    },
    {
      "icon": "heart",
      "title": "Wellness",
      "description": "Programs focused on health and wellbeing."
    }
  ]
}
```

### Card Options

| Property | Type | Options |
|----------|------|---------|
| `icon` | string | `users`, `graduation-cap`, `heart`, `laptop`, `star`, `trophy` |
| `title` | string | - |
| `description` | string | - |
| `link` | string | Optional URL |

### Grid Options

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `columns` | number | `2`, `3`, `4` | `3` |

---

## 6. Call to Action

Highlighted call-to-action box.

```json
{
  "_template": "ctaBox",
  "title": "Ready to Get Started?",
  "description": "Join our community today and make a difference.",
  "primaryButton": {
    "text": "Join Now",
    "link": "/join"
  },
  "secondaryButton": {
    "text": "Learn More",
    "link": "/about"
  },
  "variant": "primary"
}
```

### Options

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `variant` | string | `primary`, `secondary`, `accent` | `primary` |

---

## 7. FAQ / Accordion

Expandable questions and answers.

```json
{
  "_template": "faq",
  "title": "Frequently Asked Questions",
  "items": [
    {
      "question": "How do I get started?",
      "answer": "Simply contact us through our form or call our office."
    },
    {
      "question": "What are your hours?",
      "answer": "We're open Monday through Friday, 9am to 5pm."
    }
  ]
}
```

### Item Options

| Property | Type | Required |
|----------|------|----------|
| `question` | string | Yes |
| `answer` | string | Yes |

---

## 8. Image Gallery

Photo grid with optional lightbox.

```json
{
  "_template": "imageGallery",
  "title": "Our Gallery",
  "layout": "masonry",
  "images": [
    {
      "src": "/images/gallery/1.jpg",
      "alt": "Event photo",
      "caption": "Community gathering 2024"
    }
  ]
}
```

### Options

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `layout` | string | `grid`, `masonry` | `grid` |
| `columns` | number | `2`, `3`, `4` | `3` |

---

## 9. Contact Info

Contact details with optional map.

```json
{
  "_template": "contactInfo",
  "title": "Get in Touch",
  "address": "123 Main Street, City, State 12345",
  "phone": "(555) 123-4567",
  "email": "info@example.com",
  "hours": "Monday - Friday: 9am - 5pm",
  "showMap": true,
  "mapEmbed": "<iframe src='...'></iframe>"
}
```

### Options

| Property | Type | Required |
|----------|------|----------|
| `title` | string | No |
| `address` | string | No |
| `phone` | string | No |
| `email` | string | No |
| `hours` | string | No |
| `showMap` | boolean | No |
| `mapEmbed` | string | No |

---

## 10. Stats / Numbers

Impressive statistics display.

```json
{
  "_template": "stats",
  "title": "Our Impact",
  "stats": [
    {
      "value": "10,000+",
      "label": "People Served",
      "icon": "users"
    },
    {
      "value": "50+",
      "label": "Programs",
      "icon": "graduation-cap"
    }
  ]
}
```

### Stat Options

| Property | Type | Required |
|----------|------|----------|
| `value` | string | Yes |
| `label` | string | Yes |
| `icon` | string | No |

---

## 11. Testimonials

Customer/client quotes.

```json
{
  "_template": "testimonials",
  "title": "What People Say",
  "layout": "carousel",
  "items": [
    {
      "quote": "This program changed my life.",
      "author": "Jane Doe",
      "role": "Program Graduate",
      "image": "/images/testimonials/jane.jpg"
    }
  ]
}
```

### Options

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `layout` | string | `grid`, `carousel` | `grid` |

---

## 12. Video Embed

YouTube or Vimeo video embed.

```json
{
  "_template": "video",
  "title": "Watch Our Story",
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "caption": "Our 2024 annual report video"
}
```

### Supported Platforms

- YouTube
- Vimeo
- Direct video URLs (.mp4, .webm)

---

## 13. Timeline

Chronological event display.

```json
{
  "_template": "timeline",
  "title": "Our Journey",
  "events": [
    {
      "year": "2020",
      "title": "Founded",
      "description": "Started with a small team of volunteers."
    },
    {
      "year": "2022",
      "title": "Expanded",
      "description": "Opened three new locations."
    }
  ]
}
```

### Event Options

| Property | Type | Required |
|----------|------|----------|
| `year` | string | Yes |
| `title` | string | Yes |
| `description` | string | Yes |

---

## 14. Team Members

Staff or team grid.

```json
{
  "_template": "team",
  "title": "Our Team",
  "members": [
    {
      "name": "John Smith",
      "role": "Executive Director",
      "image": "/images/team/john.jpg",
      "bio": "John has 20 years of experience in community development.",
      "linkedin": "https://linkedin.com/in/johnsmith"
    }
  ]
}
```

### Member Options

| Property | Type | Required |
|----------|------|----------|
| `name` | string | Yes |
| `role` | string | Yes |
| `image` | string | No |
| `bio` | string | No |
| `linkedin` | string | No |
| `email` | string | No |

---

## 15. Divider

Visual separator between sections.

```json
{
  "_template": "divider",
  "style": "line",
  "spacing": "medium"
}
```

### Options

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `style` | string | `line`, `dots`, `space` | `line` |
| `spacing` | string | `small`, `medium`, `large` | `medium` |

---

## Using Blocks

### In Content Files

Add blocks to the `blocks` array in any page content file:

```json
{
  "title": "About Us",
  "blocks": [
    { "_template": "heroBanner", "title": "About Us" },
    { "_template": "textBlock", "title": "Our Story", "body": "..." },
    { "_template": "team", "title": "Our Team", "members": [...] }
  ]
}
```

### In TinaCMS Admin

1. Open admin at `/admin/index.html`
2. Navigate to the page
3. Click "Add Block"
4. Select block type
5. Fill in content
6. Save

---

## Creating Custom Blocks

### 1. Create Component

```tsx
// src/components/blocks/MyBlock.tsx
import { Container } from "@/components/ui/Container";

interface MyBlockProps {
  title: string;
  content: string;
}

export function MyBlock({ title, content }: MyBlockProps) {
  return (
    <section className="section">
      <Container>
        <h2>{title}</h2>
        <p>{content}</p>
      </Container>
    </section>
  );
}
```

### 2. Add to BlockRenderer

```tsx
// src/components/blocks/BlockRenderer.tsx
import { MyBlock } from "./MyBlock";

// Add to switch statement:
case "myBlock":
  return <MyBlock key={index} {...props} />;
```

### 3. Add to TinaCMS Schema

```typescript
// tina/blocks.ts
export const myBlockTemplate = {
  name: "myBlock",
  label: "My Block",
  fields: [
    { name: "title", type: "string", label: "Title" },
    { name: "content", type: "string", label: "Content", ui: { component: "textarea" } },
  ],
};
```

### 4. Export from Index

```tsx
// src/components/blocks/index.tsx
export { MyBlock } from "./MyBlock";
```

---

## Best Practices

1. **Consistent Styling**: Use CSS variables for colors
2. **Responsive**: Test all blocks on mobile
3. **Accessibility**: Include alt text and ARIA labels
4. **Performance**: Optimize images before upload
5. **Content**: Keep text concise and scannable
