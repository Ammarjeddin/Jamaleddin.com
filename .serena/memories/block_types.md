# Block Types Reference

These are the 15 block/section types the template must support. Each block is a reusable content component that editors can add to any page via TinaCMS.

## 1. Text Block
**Category:** Basic
**Description:** Simple title with paragraph content
**Fields:**
- title (string, required)
- content (rich-text/textarea, required)

## 2. Hero Banner
**Category:** Headers
**Description:** Large banner with background image and call-to-action
**Fields:**
- title (string, required)
- subtitle (string)
- backgroundImage (image)
- buttonText (string)
- buttonLink (string)

## 3. Image + Text (Left)
**Category:** Content
**Description:** Image on the left with text on the right
**Fields:**
- title (string, required)
- content (rich-text, required)
- image (image, required)

## 4. Image + Text (Right)
**Category:** Content
**Description:** Text on the left with image on the right
**Fields:**
- title (string, required)
- content (rich-text, required)
- image (image, required)

## 5. Cards Grid
**Category:** Content
**Description:** Grid of cards with icons, titles, and descriptions
**Fields:**
- title (string) - Section title
- cards (array):
  - icon (string) - Lucide icon name
  - title (string, required)
  - description (string)

## 6. Call to Action (CTA)
**Category:** Engagement
**Description:** Highlighted box prompting user action
**Fields:**
- title (string, required)
- content (textarea)
- buttonText (string, required)
- buttonLink (string, required)
- style (select: primary, secondary, accent)

## 7. FAQ / Accordion
**Category:** Content
**Description:** Expandable questions and answers
**Fields:**
- title (string) - Section title
- items (array):
  - question (string, required)
  - answer (textarea, required)

## 8. Image Gallery
**Category:** Media
**Description:** Grid of images with optional captions
**Fields:**
- title (string)
- images (array):
  - src (image, required)
  - alt (string)
  - caption (string)

## 9. Contact Info
**Category:** Contact
**Description:** Display contact details
**Fields:**
- title (string)
- showPhone (boolean)
- showEmail (boolean)
- showAddress (boolean)
- additionalInfo (textarea)

## 10. Stats / Numbers
**Category:** Engagement
**Description:** Display impressive numbers and achievements
**Fields:**
- title (string)
- stats (array):
  - number (string, required) - e.g., "500+", "95%"
  - label (string, required)

## 11. Testimonials
**Category:** Engagement
**Description:** Quotes from community members or clients
**Fields:**
- title (string)
- testimonials (array):
  - quote (textarea, required)
  - author (string, required)
  - role (string)
  - avatar (image)

## 12. Video Embed
**Category:** Media
**Description:** Embedded YouTube or Vimeo video
**Fields:**
- title (string)
- videoUrl (string, required) - YouTube/Vimeo URL
- description (textarea)

## 13. Timeline
**Category:** Content
**Description:** Vertical timeline of events or milestones
**Fields:**
- title (string)
- events (array):
  - year (string, required)
  - title (string, required)
  - description (textarea)

## 14. Team Members
**Category:** Content
**Description:** Display team or staff members
**Fields:**
- title (string)
- members (array):
  - name (string, required)
  - role (string)
  - image (image)
  - bio (textarea)

## 15. Divider / Spacer
**Category:** Basic
**Description:** Visual separator between sections
**Fields:**
- style (select: line, dots, space)
- spacing (select: small, medium, large)

---

## Block Categories

| Category | Blocks |
|----------|--------|
| Basic | Text Block, Divider |
| Headers | Hero Banner |
| Content | Image+Text (L/R), Cards Grid, FAQ, Timeline, Team |
| Engagement | CTA, Stats, Testimonials |
| Media | Image Gallery, Video |
| Contact | Contact Info |
