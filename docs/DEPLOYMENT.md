# Deployment Guide

This guide covers deploying your website to various hosting platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Vercel (Recommended)](#vercel-recommended)
- [Netlify](#netlify)
- [Self-Hosted](#self-hosted)
- [Environment Variables](#environment-variables)
- [TinaCMS Cloud](#tinacms-cloud)
- [Custom Domain](#custom-domain)
- [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before deploying, ensure:

1. All content is committed to Git
2. Build passes locally: `npm run build`
3. No TypeScript errors: `npm run lint`
4. Images are optimized
5. Environment variables are ready

---

## Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

### Quick Deploy

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "New Project"

4. Import your repository

5. Configure:
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `npm run build` (or `npm run build:tina` for TinaCMS)
   - Output Directory: `.next`

6. Add environment variables (if using TinaCMS Cloud):
   ```
   NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id
   TINA_TOKEN=your-token
   ```

7. Click "Deploy"

### Automatic Deployments

- Every push to `main` triggers a production deployment
- Pull requests get preview deployments
- Rollback to any previous deployment instantly

### Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

---

## Netlify

### Quick Deploy

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [app.netlify.com](https://app.netlify.com)

3. Click "Add new site" > "Import an existing project"

4. Connect your repository

5. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `.next`

6. Add environment variables in Site Settings > Build & Deploy > Environment

7. Click "Deploy site"

### netlify.toml (Optional)

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

### Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

---

## Self-Hosted

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

The server runs on port 3000 by default.

### With PM2 (Process Manager)

```bash
# Install PM2
npm i -g pm2

# Start with PM2
pm2 start npm --name "my-site" -- start

# Save process list
pm2 save

# Auto-start on reboot
pm2 startup
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

Update `next.config.ts`:

```typescript
const nextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

Build and run:

```bash
docker build -t my-site .
docker run -p 3000:3000 my-site
```

---

## Environment Variables

### Required for TinaCMS Cloud

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_TINA_CLIENT_ID` | TinaCMS Client ID |
| `TINA_TOKEN` | TinaCMS API Token |

### Optional

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Production URL for SEO |

### Setting Variables

#### Vercel
Settings > Environment Variables

#### Netlify
Site settings > Build & deploy > Environment

#### Self-hosted
Create `.env.production`:
```
NEXT_PUBLIC_TINA_CLIENT_ID=xxx
TINA_TOKEN=xxx
```

---

## TinaCMS Cloud

For team editing and cloud-based content management:

### Setup

1. Create account at [tina.io](https://tina.io)

2. Create new project and connect your repository

3. Get your Client ID and Token from the dashboard

4. Add environment variables to your hosting platform

5. Use `npm run build:tina` for builds

### Benefits

- Visual editing in production
- Team collaboration
- Content versioning
- Media management
- Draft/publish workflow

---

## Custom Domain

### Vercel

1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL is automatic

### Netlify

1. Go to Site settings > Domain management
2. Add custom domain
3. Update DNS records
4. SSL via Let's Encrypt (automatic)

### DNS Records

Point your domain to your hosting:

```
Type    Name    Value
A       @       76.76.21.21 (Vercel example)
CNAME   www     cname.vercel-dns.com
```

---

## Post-Deployment Checklist

### Functionality
- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Forms submit (if applicable)
- [ ] Images load properly
- [ ] Mobile responsive

### Performance
- [ ] Run Lighthouse audit (aim for 90+)
- [ ] Check Core Web Vitals
- [ ] Verify image optimization
- [ ] Test page load speed

### SEO
- [ ] Meta titles and descriptions
- [ ] Open Graph images
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt configured
- [ ] Google Search Console setup

### Security
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] No exposed secrets
- [ ] Admin panel protected (if using TinaCMS Cloud)

### Analytics
- [ ] Google Analytics tracking
- [ ] Facebook Pixel (if applicable)
- [ ] Verify data collection

### Content
- [ ] All placeholder content replaced
- [ ] Contact information accurate
- [ ] Social links working
- [ ] Legal pages present (Privacy, Terms)

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Loading

- Verify variables are set in hosting dashboard
- Variables starting with `NEXT_PUBLIC_` are client-side
- Redeploy after adding variables

### Images Not Loading

- Check image paths (should start with `/`)
- Verify images are in `public/` directory
- Check for case sensitivity in filenames

### 404 Errors

- Verify page files exist in `src/app/`
- Check dynamic routes have `generateStaticParams`
- Redeploy if content was added

---

## Performance Optimization

### Enable Static Exports (Optional)

For fully static sites, add to `next.config.ts`:

```typescript
const nextConfig = {
  output: 'export',
};
```

Note: This disables server-side features.

### Image Optimization

Next.js automatically optimizes images. For external images, configure domains in `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    domains: ['your-cdn.com'],
  },
};
```

### Caching

Vercel and Netlify handle caching automatically. For self-hosted, configure nginx/apache caching.

---

## Support

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [TinaCMS Deployment](https://tina.io/docs/tina-cloud/deployment-options)
