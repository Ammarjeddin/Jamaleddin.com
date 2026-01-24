# Suggested Commands

## Project Setup

```bash
# Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --app --src-dir

# Initialize TinaCMS
npx @tinacms/cli@latest init

# Install dependencies
npm install lucide-react
npm install @headlessui/react  # For accessible components (modals, menus)
npm install clsx               # For conditional classnames
```

## Development

```bash
# Start development server (with TinaCMS)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run type-check
# or
npx tsc --noEmit
```

## TinaCMS

```bash
# Access admin
# http://localhost:3000/admin/index.html

# Generate TinaCMS types
npx tinacms build

# TinaCMS dev mode (standalone)
npx tinacms dev
```

## Git

```bash
# Initial commit
git add .
git commit -m "Initial template setup"
git push origin main

# Create feature branch
git checkout -b feature/block-components
```

## Deployment

```bash
# Netlify CLI (if installed)
netlify deploy --prod

# Or connect GitHub repo to Netlify dashboard for auto-deploy
```

## Linting & Formatting

```bash
# ESLint
npm run lint

# Prettier (if configured)
npm run format
```
