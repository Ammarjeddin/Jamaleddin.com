# Site-Template: Comprehensive Architectural Review

> Generated: January 28, 2026

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [1. Core Configuration and Library Layer](#1-core-configuration-and-library-layer)
- [2. State Management (Contexts and Providers)](#2-state-management-contexts-and-providers)
- [3. Layout Components](#3-layout-components)
- [4. Block/Section Components](#4-blocksection-components)
- [5. E-Commerce and Shop System](#5-e-commerce-and-shop-system)
- [6. API Routes and Authentication](#6-api-routes-and-authentication)
- [7. Admin Dashboard and Content Management](#7-admin-dashboard-and-content-management)
- [8. Pages and Content Architecture](#8-pages-and-content-architecture)
- [9. Cross-Cutting Concerns](#9-cross-cutting-concerns)
- [10. Issues Summary](#10-issues-summary)
- [11. Architecture Diagrams](#11-architecture-diagrams)

---

## Executive Summary

The **site-template** repository is a comprehensive Next.js 16 application built with React 19, TypeScript (strict mode), and Tailwind CSS v4. It functions as a configurable website template for organizations and businesses, featuring a CMS-driven content system, an e-commerce shop with Stripe integration, an admin dashboard with a visual block editor, and a theming system with dark mode support. The project uses a file-based content architecture where JSON files in a `content/` directory serve as the data layer, with optional TinaCMS integration and GitHub-based draft/publish workflow.

The tech stack is modern and well-chosen: Next.js App Router with server/client component separation, `useReducer`-based state management for the cart, JWT authentication with bcrypt password hashing, Stripe Checkout Sessions for payments, and a comprehensive 17-block content composition system. The codebase demonstrates strong TypeScript discipline with strict mode enabled, well-defined interfaces, and clean separation of concerns between data access, authentication, UI components, and integrations.

However, the review uncovered several significant issues across all domains. **Security concerns** include a hardcoded JWT secret fallback that enables token forgery in misconfigured deployments, client-submitted prices in the checkout API that enable price manipulation, and middleware that checks only for cookie existence rather than token validity. **Architectural gaps** include a dual content system on the home page where CMS-managed blocks are defined but never rendered, a TinaCMS pages collection format mismatch (declares MDX but files are JSON), and three different dark mode implementation strategies creating visual inconsistencies. **Dead code** is present in several modules, including an entire unused font pairing system, an unreferenced `ContentEditor` component superseded by `VisualEditor`, and multiple exported functions/types that are never consumed.

The project is well-structured for a template/prototype and demonstrates strong foundational architecture. With targeted fixes to the security vulnerabilities, consolidation of duplicate types and dark mode approaches, and completion of partially-implemented features (media upload, new item creation, publishing UI), it would be production-ready for low-to-medium traffic deployments.

---

## 1. Core Configuration and Library Layer

### 1.1 `package.json`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/package.json`

**Scripts:**
| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Standard Next.js dev server |
| `dev:tina` | `tinacms dev -c "next dev"` | Dev server with TinaCMS visual editing |
| `build` | `next build` | Standard production build |
| `build:tina` | `tinacms build && next build` | Production build with TinaCMS content layer |
| `start` | `next start` | Production server |
| `lint` | `eslint` | Lint with ESLint (no file argument -- relies on config) |

**Dependencies (runtime):**
| Package | Version | Role |
|---------|---------|------|
| `@stripe/stripe-js` | ^8.6.4 | Client-side Stripe.js for payment UI |
| `@tinacms/cli` | ^2.1.1 | TinaCMS CLI for content management |
| `bcryptjs` | ^3.0.3 | Password hashing for admin auth |
| `clsx` | ^2.1.1 | Conditional CSS class composition |
| `jsonwebtoken` | ^9.0.3 | JWT token generation/verification |
| `lucide-react` | ^0.563.0 | Icon library |
| `next` | 16.1.4 | Next.js framework |
| `react` / `react-dom` | 19.2.3 | React 19 |
| `stripe` | ^20.2.0 | Server-side Stripe SDK |
| `tailwind-merge` | ^3.4.0 | Intelligent Tailwind class merging |
| `tinacms` | ^3.3.1 | TinaCMS headless CMS |

**DevDependencies:**
| Package | Version | Role |
|---------|---------|------|
| `@tailwindcss/postcss` | ^4 | Tailwind v4 PostCSS plugin |
| `@types/bcryptjs` | ^2.4.6 | Types for bcryptjs |
| `@types/jsonwebtoken` | ^9.0.10 | Types for jsonwebtoken |
| `@types/node` | ^20 | Node.js types |
| `@types/react` / `@types/react-dom` | ^19 | React 19 types |
| `eslint` / `eslint-config-next` | ^9 / 16.1.4 | Linting |
| `tailwindcss` | ^4 | Tailwind CSS v4 |
| `typescript` | ^5 | TypeScript compiler |

**Concerns:**
- `@tinacms/cli` is in `dependencies` rather than `devDependencies`. It is only needed for the `dev:tina` and `build:tina` scripts (CLI tooling), not at runtime. This inflates the production `node_modules`.
- `bcryptjs` and `jsonwebtoken` are server-only dependencies that will be bundled if not carefully tree-shaken. They are correctly used only in server-side files (`auth.ts`), so Next.js should handle this, but there is no explicit `server-only` import guard.
- The `lint` script invokes bare `eslint` with no file targets; this relies entirely on the flat config to know what to lint.

---

### 1.2 `tsconfig.json`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/tsconfig.json`

**Key settings:**
- `target: "ES2017"` -- Compiles to ES2017, which supports async/await natively.
- `strict: true` -- Full strict mode enabled.
- `jsx: "react-jsx"` -- Uses the automatic JSX runtime (React 17+ transform).
- `moduleResolution: "bundler"` -- Next.js bundler-aware resolution.
- `paths: { "@/*": ["./src/*"] }` -- Enables `@/` alias pointing to `src/`.
- `include` covers `**/*.ts`, `**/*.tsx`, `**/*.mts`, `next-env.d.ts`, and `.next/types`.
- `exclude` only excludes `node_modules`.

---

### 1.3 `next.config.ts`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/next.config.ts`

**Configuration:**
- `images.remotePatterns`: Allows images from `images.unsplash.com` and `via.placeholder.com` only.
- `images.unoptimized`: Set to `true` in development mode for faster builds.

**Concerns:**
- Only two external image domains are whitelisted. If product images or CMS content references images from other domains, those will fail to load with `next/image`.
- No `rewrites`, `redirects`, or `headers` configuration is present, meaning no security headers are set at the framework level.

---

### 1.4 `.env.example`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/.env.example`

**Environment variables documented:**

| Variable | Required | Public | Purpose |
|----------|----------|--------|---------|
| `JWT_SECRET` | Yes (prod) | No | JWT signing secret for admin auth |
| `GITHUB_TOKEN` | No | No | GitHub PAT for draft/publish workflow |
| `GITHUB_OWNER` | No | No | GitHub repo owner |
| `GITHUB_REPO` | No | No | GitHub repo name |
| `NEXT_PUBLIC_SITE_URL` | Yes | Yes | Used for SEO, metadata base |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Yes | Google Analytics |
| `NEXT_PUBLIC_FB_PIXEL_ID` | No | Yes | Facebook Pixel |
| `STRIPE_SECRET_KEY` | Yes (if shop) | No | Stripe server-side key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes (if shop) | Yes | Stripe client-side key |

**Concerns:**
- `JWT_SECRET` has a hardcoded fallback in `auth.ts` (`"your-super-secret-key-change-in-production"`). If a developer forgets to change it, production will use the insecure default.
- No `.env.local.example` or validation mechanism (e.g., `zod` schema for env vars) to catch misconfigurations at startup.

---

### 1.5 `src/middleware.ts`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/middleware.ts`

**Logic:**
1. Extracts `pathname` from the request URL.
2. If the path starts with `/admin` or `/dashboard`, checks for an `admin_token` cookie.
3. If no token cookie exists, redirects to `/login` with the original path as a `redirect` query parameter.
4. If a token exists, passes through (does **not** verify the JWT here).
5. Matcher restricts execution to `/admin/:path*` and `/dashboard/:path*`.

**Concerns:**
- The middleware does **not verify** the JWT token. It only checks for the existence of the cookie. A user could set any arbitrary value for `admin_token` and bypass the middleware redirect, though API calls will fail.
- This creates a confusing UX where the admin UI renders but data operations fail.

---

### 1.6 `src/lib/fonts.ts`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/lib/fonts.ts`

**Exports:**
1. `fontPairings` -- 6 font pairings (modern, classic, clean, friendly, professional, elegant)
2. `FontPairingKey` -- Union type of pairing names
3. `getFontClasses(pairing?)` -- Returns CSS variable class names for a pairing

**Font Pairings:**
| Key | Heading Font | Body Font |
|-----|-------------|-----------|
| `modern` | Plus Jakarta Sans | Inter |
| `classic` | Playfair Display | Source Sans 3 |
| `clean` | Montserrat | Open Sans |
| `friendly` | Nunito | Lato |
| `professional` | Raleway | Roboto |
| `elegant` | Cormorant Garamond | Inter |

**Concerns:**
- **Dead code**: This entire module is currently unused. `layout.tsx` duplicates the font loading for the "modern" pairing directly. The font pairing system is never invoked.
- All 11 Google Fonts are instantiated at module load time even though only "modern" is used.

---

### 1.7 `src/lib/stripe.ts`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/lib/stripe.ts`

**Exports:**
1. `getStripe()` -- Lazy-initialized Stripe server SDK singleton.
2. `getStripePublishableKey()` -- Returns publishable key (or empty string).

**Concerns:**
- `getStripePublishableKey()` returns `""` when the env var is missing, causing silent failures. This function is also **never called** anywhere in the codebase.
- The Stripe API version `"2025-12-15.clover"` is correctly pinned.

---

### 1.8 `src/lib/github.ts`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/lib/github.ts`

**Exports:**

| Export | Description |
|--------|-------------|
| `isGitHubConfigured()` | Returns true if all three env vars are set |
| `getFileFromGitHub(filePath, branch?)` | Fetches file from GitHub Contents API |
| `saveFileToGitHub(filePath, content, message, branch?, sha?)` | Creates/updates file on a branch |
| `ensureBranchExists(branch)` | Creates branch from main if needed |
| `publishDraftToMain()` | Merges draft branch into main |
| `listFilesInDirectory(dirPath, branch?)` | Lists files in a directory |
| `deleteFileFromGitHub(filePath, message, branch?)` | Deletes a file from a branch |

**Concerns:**
- Environment variables captured at module load time (module caching issue).
- No rate limiting or retry logic for GitHub API calls.
- `ensureBranchExists` has a race condition under concurrent calls.
- `publishDraftToMain` hardcodes the `"draft"` branch name.
- `GitHubFile` interface is exported but never used (dead type).

---

### 1.9 `src/lib/navigation.ts`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/lib/navigation.ts`

**Exports:**
- `NavItem` interface, `defaultNavigation` constant, `getNavigation()` function, `isShopEnabled()` function

**Concerns:**
- `defaultNavigation` is **never imported** (dead code).
- `getNavigation` hardcodes 4 program sub-items rather than reading from the filesystem.
- Type assertion bridges `NavigationItem` and `NavItem` (structurally identical but nominally different types).

---

### 1.10 `src/lib/products.ts`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/lib/products.ts`

**Exports:** 11 functions for product data access (getProduct, getAllProducts, getActiveProducts, getFeaturedProducts, getProductsByCategory, getProductsByTag, getProductCategories, getProductTags, searchProducts, getFilteredProducts, getProductSlugs).

**Concerns:**
- **All functions are declared `async` but use synchronous `fs.readFileSync`**. This is misleading: callers await these functions but they actually block the event loop.
- **No caching**: Every call re-reads the filesystem.
- **`getAllProducts` swallows JSON parse errors** silently.

---

### 1.11 `src/lib/auth.ts`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/lib/auth.ts`

**Exports:** `hashPassword`, `verifyPassword`, `authenticateUser`, `generateToken`, `verifyToken`, `createUser`, `updatePassword`, `getAllUsers`, `deleteUser`, plus `User`, `UserSession`, `UsersData` interfaces.

**Concerns:**
- **Insecure JWT_SECRET fallback**: `"your-super-secret-key-change-in-production"` -- critical security vulnerability.
- **File-based user storage** with no concurrency protection.
- **`Date.now()` for user IDs** -- not collision-free.
- **Development backdoor**: `admin/admin` credentials in development mode.
- `createUser`, `updatePassword`, `getAllUsers`, and `deleteUser` are **never called** (dead code).
- No password strength validation.

---

### 1.12 `src/lib/tina.ts`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/lib/tina.ts`

The central data layer providing `SiteSettings`, content-fetching functions, and type definitions. Returns data wrapped in TinaCMS-compatible response shapes.

**Concerns:**
- Synchronous file I/O in all functions.
- `getHomeContent` returns `any` (no type safety).
- Duplicate `SiteSettings` type definition (also in `useSiteSettings.ts`).
- `NavigationItem` duplicates `NavItem` from `navigation.ts`.

---

### 1.13 `src/lib/types/product.ts`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/lib/types/product.ts`

Comprehensive e-commerce type system covering physical, digital, and service products with inventory, pricing, variants, and utility functions.

**Concerns:**
- `formatPrice` hardcodes `"en-US"` locale for all currencies.
- `sortProducts` "newest" option does nothing (no date field on Product type).
- `ShopSettings` duplicates `ShopFeatureSettings` from `tina.ts`.
- `Product.longDescription` typed as `unknown`.
- Tags stored as comma-separated string rather than `string[]`.

---

### 1.14 `src/lib/utils/cn.ts`

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/lib/utils/cn.ts`

The canonical `cn` utility (`clsx` + `twMerge`). Used by 23+ components. No concerns.

---

### 1.15 `src/app/globals.css`

CSS custom properties theming system with Tailwind v4, class-based dark mode, and utility classes. Dark mode intentionally keeps cards/surfaces white with dark page backgrounds.

---

### 1.16 `src/app/layout.tsx`

Root layout with provider hierarchy: `DarkModeProvider > ThemeProvider > CartProvider (conditional)`.

**Concerns:**
- Fonts hardcoded (bypasses `fonts.ts` pairing system).
- `getSiteSettings()` called twice per page load (no deduplication for sync reads).
- `suppressHydrationWarning` masks genuine hydration errors.

---

### Core Layer Dependency Graph

```
                          +-----------------+
                          |   globals.css   |
                          +--------+--------+
                                   |
                          +--------v--------+
                          |   layout.tsx    |
                          +--------+--------+
                                   |
                    +--------------+-------------+
                    |              |              |
             +------v------+ +----v----+  +------v-------+
             | ThemeProvider| | CartCtx |  | DarkModeCtx  |
             +------+------+ +----+----+  +--------------+
                    |              |
         +----------+         +---v-----------+
         |                    | types/product |
  +------v------+            +------+---------+
  |useSiteSettings|                  |
  |(type only)   |           +------v------+
  +-------------+            |  CartDrawer |
                              +-------------+

  +----------+     +------------+     +-----------+
  |  tina.ts |<----|navigation.ts|--->| All Pages |
  +----+-----+     +-----+------+     | All Nav   |
       |                  |            | All Footer|
       v                  v            +-----------+
  content/settings/   feature flags
  content/home/       determine nav
  content/pages/
  content/programs/

  +------------+     +-----------+
  | products.ts|---->|types/      |
  +-----+------+     |product.ts |
        |             +-----+-----+
        v                   |
  content/products/         v
                      Shop components
                      Cart components
                      Dashboard

  +----------+        +-----------+
  |  auth.ts |        | github.ts |
  +----+-----+        +-----+-----+
       |                     |
       v                     v
  API routes            API routes
  (login,session,       (content,
   content)              publish)

  +-----------+         +---------+
  | stripe.ts |         | cn.ts   |
  +-----+-----+         +----+----+
        |                     |
        v                     v
  API/checkout           23+ UI
                         components

  +-----------+
  |  fonts.ts |  (UNUSED - dead code)
  +-----------+

  +-----------------+
  | middleware.ts   |  (runs on Edge, guards /admin, /dashboard)
  +-----------------+
```

### Dead Code Summary

| File/Export | Status |
|-------------|--------|
| `src/lib/fonts.ts` (entire module) | Never imported by any file |
| `defaultNavigation` in `navigation.ts` | Never imported |
| `getStripePublishableKey()` in `stripe.ts` | Never called |
| `GitHubFile` interface in `github.ts` | Never used |
| `useSiteSettings` hook in `useSiteSettings.ts` | Never called (only type export used) |
| `createUser`, `updatePassword`, `getAllUsers`, `deleteUser` in `auth.ts` | Never called from outside `auth.ts` |

### Type Duplication

1. **`SiteSettings`** defined in both `tina.ts` and `useSiteSettings.ts` with different shapes.
2. **`NavItem`** (in `navigation.ts`) vs **`NavigationItem`** (in `tina.ts`) -- structurally identical.
3. **`ShopSettings`** (in `types/product.ts`) vs **`ShopFeatureSettings`** (in `tina.ts`) -- different optional/required semantics.

---

## 2. State Management (Contexts and Providers)

### 2.1 `src/contexts/CartContext.tsx`

**Directive:** `"use client"`

#### Constants

| Name | Value | Purpose |
|------|-------|---------|
| `CART_STORAGE_KEY` | `"site-template-cart"` | localStorage key for cart persistence |

#### Type: `CartState`

```typescript
interface CartState {
  items: CartItem[];   // Array of products with quantities
  isOpen: boolean;     // Controls the CartDrawer visibility
}
```

This conflates shopping data (items) and UI state (isOpen).

#### Type: `CartAction` (Discriminated Union)

| Action Type | Payload | Purpose |
|-------------|---------|---------|
| `ADD_ITEM` | `{ product: Product; quantity: number; variantId?: string }` | Add a product or increment existing |
| `REMOVE_ITEM` | `{ productSlug: string; variantId?: string }` | Remove item by slug + variant |
| `UPDATE_QUANTITY` | `{ productSlug: string; quantity: number; variantId?: string }` | Set absolute quantity; removes if <= 0 |
| `CLEAR_CART` | none | Empty all items |
| `TOGGLE_CART` | none | Flip isOpen boolean |
| `OPEN_CART` | none | Set isOpen = true |
| `CLOSE_CART` | none | Set isOpen = false |
| `LOAD_CART` | `CartItem[]` | Hydrate from localStorage |

#### CartProvider Internal Mechanics

1. **useReducer**: Initializes with `{ items: [], isOpen: false }`.
2. **Effect 1 (Load)**: Runs on mount only. Reads localStorage, dispatches `LOAD_CART`. Causes a brief "flash of empty cart" before hydration.
3. **Effect 2 (Save)**: Runs on `state.items` changes. Writes to localStorage. Risk: initial render fires with `items: []`, potentially clearing saved cart before LOAD_CART completes.
4. **Derived values**: `itemCount` and `subtotal` are computed on every render (not memoized).
5. **Memoized callbacks**: All dispatch wrappers use `useCallback` with stable references.
6. **Context value**: New object literal on every render. **Not memoized with `useMemo`** -- causes unnecessary consumer re-renders.

#### useCart Hook

Throws `Error("useCart must be used within a CartProvider")` if context is null.

---

### 2.2 `src/contexts/DarkModeContext.tsx`

**Directive:** `"use client"`

#### DarkModeProvider Internal Mechanics

1. **State**: `isDarkMode` (boolean, starts `false`) and `mounted` (boolean, starts `false`).
2. **Effect 1 (Initialize)**: Sets mounted, reads localStorage, falls back to `prefers-color-scheme: dark`. **No try/catch around `localStorage.getItem`** -- can crash if localStorage is unavailable.
3. **Effect 2 (Apply)**: Adds/removes `"dark"` class on `document.documentElement`. Saves preference to localStorage.
4. **Callbacks**: `toggleDarkMode` and `setDarkMode` are **not memoized** with `useCallback`.
5. **Context value**: Not memoized -- all 11+ consumers re-render on every provider render.
6. **FOUC**: Initial state is `false` (light mode). Users preferring dark mode see a flash before the effect fires.

---

### 2.3 `src/components/providers/ThemeProvider.tsx`

**Directive:** `"use client"`

This is **not a React Context**. It is a side-effect-only provider that applies CSS custom properties to `document.documentElement` via `style.setProperty()`.

#### ThemeProvider Internal Mechanics

1. Single `useEffect([settings])` that reads `settings.theme` and sets CSS variables.
2. Generates light/dark color variants using `adjustColor` helper.
3. No cleanup -- stale CSS properties persist if settings change.
4. `adjustColor` does not handle 3-character hex, named colors, or `rgb()`/`hsl()` values.

---

### State Architecture

| Context/Provider | State Type | Mechanism | Persistence | Scope |
|-----------------|-----------|-----------|-------------|-------|
| `CartContext` | Application data + UI state | `useReducer` | localStorage | Conditional (shop-enabled only) |
| `DarkModeContext` | User preference | `useState` | localStorage + system media query | Global (always present) |
| `ThemeProvider` | None (side-effect only) | `useEffect` | CSS custom properties on DOM | Global (always present) |

### Data Flow

```
Server Component (layout.tsx)
  |
  |--- getSiteSettings() -> settings
  |
  v
<DarkModeProvider>                    [localStorage: "site-template-dark-mode"]
  |                                   [document.documentElement.classList: "dark"]
  |
  <ThemeProvider settings={settings}> [document.documentElement.style: CSS vars]
    |
    <CartProvider>                    [localStorage: "site-template-cart"]
      |
      {children}
      <CartDrawer />
```

### Critical: CSS Variable Conflict (ThemeProvider vs Dark Mode)

ThemeProvider's inline `style.setProperty` calls on `document.documentElement` **override** the `.dark` class CSS rules for `--color-background` and `--color-text`. CSS specificity means inline styles always win. **Dark mode background/text colors will not work** when CMS provides theme colors. This is the most impactful architectural issue in the state management layer.

### Consumer Patterns

#### CartContext Consumers (9 components)

| Component | Values Used |
|-----------|-------------|
| CartDrawer | items, isOpen, closeCart, subtotal, itemCount, clearCart |
| CartItem | updateQuantity, removeItem |
| CartIcon | itemCount, toggleCart |
| AddToCartButton | addItem, openCart |
| StripeCheckout | items |
| CartPage | items, subtotal, itemCount, updateQuantity, removeItem, clearCart |
| CheckoutPage | items, subtotal, itemCount |
| SuccessPage | clearCart |
| MobileMenu | itemCount, toggleCart (conditional, try/catch) |

#### DarkModeContext Consumers (11+ components)

Including DarkModeToggle, DashboardHeader, NavLinks, MobileMenu, Stats, Timeline, ContactInfo, ShopPageClient, ProductSort, ProductCard, ProductFilters.

**Anti-Pattern**: Many components consume `useDarkMode()` solely to apply conditional CSS classes, when Tailwind's `dark:` variant would work without a context dependency. This creates unnecessary re-renders.

### MobileMenu Rules of Hooks Violation

```typescript
let cartContext = null;
try {
  if (showCart) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    cartContext = useCart();
  }
} catch { /* Cart context not available */ }
```

This violates React's Rules of Hooks. The `eslint-disable` comment acknowledges the violation. While it works when `showCart` is stable across renders, it is technically incorrect and fragile.

---

## 3. Layout Components

### 3.1 Container

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/components/ui/Container.tsx`

| Size | Max Width |
|------|-----------|
| `default` | `max-w-7xl` (1280px) |
| `narrow` | `max-w-4xl` (896px) |
| `wide` | `max-w-screen-2xl` (1536px) |
| `full` | `max-w-full` (no constraint) |

Base styles: `mx-auto px-4 sm:px-6 lg:px-8`. No concerns.

---

### 3.2 Button

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/components/ui/Button.tsx`

Polymorphic button/link component. Renders `<Link>` when `href` is provided, `<button>` otherwise. Uses `forwardRef`.

**Concerns:**
- Type mismatch: extends `ButtonHTMLAttributes` but renders `<Link>` when `href` is set. Button-specific props silently ignored.
- `ghost` variant lacks `dark:` counterpart for hover.
- `ref` not forwarded in the `<Link>` path.

---

### 3.3 NavLinks

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/components/layout/Navbar/NavLinks.tsx`

Desktop navigation with hover-activated dropdowns. Hidden below `lg` breakpoint.

**Concerns:**
1. **Duplicate `isNavItemActive`** -- same function exists in MobileMenu.
2. **Inline styles override Tailwind** -- `style={textStyle}` makes `dark:` classes ineffective for text color.
3. **Dropdown uses label as key** -- conflicts if two items share the same label.
4. **No keyboard accessibility** -- dropdowns open on hover only.
5. **TransparentNavbar's `linkClassName` overridden** by NavLinks' inline styles.

---

### 3.4 Navbar Variants

#### FloatingNavbar
Frosted glass pill, fixed position, includes DarkModeToggle.

#### FixedNavbar
Solid white bar, h-16. **No dark mode support** -- hardcoded `bg-white`. No DarkModeToggle.

#### TransparentNavbar
Transparent to solid on scroll (threshold: 100px). **No dark mode** on scrolled state. Scroll listener has no throttle and no `passive: true`.

### Navbar Variant Comparison

| Variant | Dark Mode Toggle | Height | Dark Mode Support |
|---------|-----------------|--------|-------------------|
| `floating` (default) | Yes (desktop) | Dynamic | Good |
| `fixed` | No | h-16 (64px) | None |
| `transparent` | No | h-20 (80px) | None |

---

### 3.5 MobileMenu

Full-screen slide-out drawer with accordion submenus. Violates Rules of Hooks (conditional `useCart`). **No body scroll lock** when open. Good dark mode support.

---

### 3.6 Footer Variants

| Variant | Columns | Navigation | Newsletter |
|---------|---------|------------|------------|
| `full` (default) | 4 (responsive grid) | First 6 items | Yes (non-functional) |
| `centered` | 1 (stacked) | First 6 items | No |
| `minimal` | 1 row | Hardcoded links only | No |

All footers use `bg-gray-900 text-white` (same in light/dark mode). All include a publicly visible admin dashboard link (Settings gear icon).

**Non-functional newsletter form** in FullFooter has no submit handler.

---

### 3.7 PageLayout

Composes `Navbar > <main> > Footer`. No `variant` prop passed to either -- both resolve from `settings.layout`.

**Critical concern:** All navbar variants use `position: fixed`, but `<main>` has no top padding. Every page must independently handle the navbar height offset (e.g., `-mt-20 pt-40`). No skip-to-content link for accessibility.

---

### Layout Component Tree

```
RootLayout (layout.tsx)
  -> DarkModeProvider
    -> ThemeProvider
      -> CartProvider (conditional on shopEnabled)
        -> [Page Component]
          -> PageLayout
            -> Navbar (factory)
              -> FloatingNavbar | FixedNavbar | TransparentNavbar
                -> Container
                -> NavLinks (desktop, hidden < lg)
                -> MobileMenu (hidden >= lg)
                -> DarkModeToggle (FloatingNavbar only)
                -> CartIcon (conditional)
            -> <main>{children}</main>
            -> Footer (factory)
              -> FullFooter | MinimalFooter | CenteredFooter
                -> Container
```

---

## 4. Block/Section Components

### 4.1 Block Registration System

#### BlockRenderer

**Path:** `/Users/ammarjeddin/Local/Projects/site-template/src/components/blocks/BlockRenderer.tsx`

17-case switch statement mapping `_template` to components. The `Block` interface uses `[key: string]: unknown` for loose typing.

**Key Design Decisions:**
- Uses **array index as React key** (fragile if blocks are reordered).
- First block gets `isFirstBlock: true` injected for navbar overlap handling.
- All 17 imports are eagerly loaded (no code splitting).
- Type casts go through `unknown` intermediary, bypassing TypeScript checks.
- Default case logs `console.warn` and renders `null`.

---

### 4.2 All 17 Block Components

#### TextBlock (Server Component)
HTML content via `dangerouslySetInnerHTML`. Container: narrow.

#### HeroBanner (Server Component)
Viewport-height hero with background image or gradient. Does NOT accept `isFirstBlock` prop.

#### ImageTextLeft / ImageTextRight (Server Components)
Two-column layouts. Nearly identical -- could be unified into a single component with `layout` prop.

#### CardsGrid (Server Component)
Dynamic icon resolution from full Lucide namespace import (`import * as LucideIcons`). **Bundle size concern**: imports entire icon library.

#### CtaBox (Server Component)
Four style variants (primary, secondary, accent, image). No `dark:` classes.

#### Faq (Client Component)
Accordion pattern. Max height of `max-h-96` clips long answers.

#### ImageGallery (Client Component)
Three layouts (grid, masonry, carousel). Lightbox with **no keyboard support** (no Escape key, no arrow navigation).

#### ContactInfo (Client Component)
Contact form is **non-functional** -- simulates 1-second delay with no backend. Uses inline dark mode styles.

#### Stats (Client Component)
Full Lucide namespace import. Hardcoded 4-column grid doesn't adapt to different stat counts.

#### Testimonials (Client Component)
Carousel auto-advances every 5 seconds. Auto-advance does not reset on manual navigation.

#### Video (Client Component)
YouTube/Vimeo embed. Vimeo thumbnails not supported. `maxresdefault.jpg` may not exist for all YouTube videos.

#### Timeline (Client Component)
Alternating vertical timeline. Dark mode via inline styles.

#### Team (Server Component)
**Content JSON has `image` field, interface expects `photo`** -- photos will not display from default content.

#### Divider (Server Component)
Four visual styles (line, dots, wave, space). Decorative-only.

#### ProductGrid (Async Server Component)
Fetches products at render time. Cannot render in client-side VisualEditor.

#### ProductShowcase (Async Server Component)
Single product feature. Returns `null` if `productSlug` is undefined.

---

### 4.3 Common Patterns

#### Dark Mode -- Three Approaches (Inconsistency)

| Approach | Blocks Using It |
|----------|----------------|
| Tailwind `dark:` classes | TextBlock, ImageTextLeft/Right, CardsGrid, Faq, ImageGallery, Testimonials, Video, Team, Divider, ProductGrid, ProductShowcase |
| Inline styles via `useDarkMode()` | ContactInfo, Stats, Timeline |
| No dark mode support | CtaBox, HeroBanner |

#### Content-Component Key Mismatches

- **Team component `photo` vs content `image`**: Team member photos will not display.
- **Testimonials `avatar` vs content `image`**: Same issue.

#### XSS via `dangerouslySetInnerHTML`

Four components render raw HTML from CMS content (TextBlock, ImageTextLeft, ImageTextRight, Faq). No sanitization library (like DOMPurify) is used.

---

## 5. E-Commerce and Shop System

### 5.1 E-Commerce Flow

```
[1] /shop (Server)
    |-- getSiteSettings(), getActiveProducts(), getProductCategories()
    |-- Renders hero + ShopPageClient
    |
[2] ShopPageClient (Client)
    |-- Filters/sorts products in memory
    |-- Renders ProductCard grid
    |
[3] ProductCard -> /shop/[slug]
    |-- Links to product detail page
    |-- Has inline "Add to Cart" button
    |
[4] /shop/[slug] (Server)
    |-- getProduct(slug), generateStaticParams(), generateMetadata()
    |-- Renders ProductDetail component
    |
[5] ProductDetail (Client)
    |-- Variant selection, quantity selection
    |-- AddToCartButton -> adds to cart + opens CartDrawer
    |
[6] CartDrawer (Client, overlay)
    |-- Quick view of cart contents
    |-- Links to /shop/cart or /shop/checkout
    |
[7] /shop/cart (Client)
    |-- Full cart management
    |-- "Proceed to Checkout" link
    |
[8] /shop/checkout (Client)
    |-- Order summary review
    |-- StripeCheckout button -> POST /api/checkout
    |-- Redirect to Stripe hosted checkout
    |
[9] Stripe Checkout (External)
    |-- User enters payment/shipping
    |-- Redirects to success_url
    |
[10] /shop/success (Client)
     |-- Clears cart on mount
     |-- Shows confirmation message
```

---

### 5.2 Stripe Integration

Uses **Stripe Checkout Sessions** (server-side redirect) -- the simplest, most secure pattern. No card data touches the server.

**What is implemented:**
- Server-side checkout session creation with dynamic `price_data`
- Conditional shipping address collection for physical products (US, CA, GB, AU)
- Promotion codes enabled
- Session metadata for order tracking

**What is NOT implemented:**
- Webhook handler for `checkout.session.completed` events
- Stripe Product/Price catalog (prices created inline)
- Inventory deduction after purchase
- Order storage/database
- Session verification on success page
- Subscription/recurring billing

---

### 5.3 Security: Price Manipulation Vulnerability

The checkout API **trusts client-provided prices**:

```typescript
unit_amount: Math.round(product.pricing.price * 100)
```

A malicious user can modify the request payload to submit products at $0.01. **This is a critical e-commerce vulnerability.** Prices should be looked up server-side from content files.

---

### 5.4 Cart State Management

React Context + `useReducer` + localStorage. Items identified by `productSlug + variantId` combination. Full `Product` objects stored per cart item (large localStorage footprint, stale pricing risk).

---

### 5.5 Product Data Pipeline

```
content/products/*.json (filesystem)
        |
        v
src/lib/products.ts (server-side, fs.readFileSync)
        |
        v
src/app/shop/page.tsx (server component)
        |
        v
ShopPageClient (client component, receives as props)
        |
        v
ProductCard / ProductDetail (render)
```

Four product JSON files covering all three product types (physical, digital, service).

---

### 5.6 Shop Edge Cases

1. **Success page does not validate Stripe session** -- anyone can navigate directly to `/shop/success`.
2. **No webhook** for reliable order confirmation.
3. **Inventory never decremented** after purchase.
4. **Currency hardcoded to USD** in cart and checkout pages.
5. **"Newest" sort has no date field** -- effectively random order.
6. **Variant price override unused** despite type definition allowing it.
7. **Shipping limited to 4 countries**.
8. **No search UI** despite `searchProducts()` existing.
9. **`longDescription` not rendered** -- placeholder only.

---

## 6. API Routes and Authentication

### 6.1 Authentication Flow

```
Client (LoginForm)                       Server
       |                                    |
       |-- POST /api/auth/login ----------->|
       |   { username, password }           |
       |                                    |-- authenticateUser()
       |                                    |   (dev: admin/admin bypass)
       |                                    |   (prod: bcrypt compare against users.json)
       |                                    |
       |                                    |-- generateToken(userSession)
       |                                    |   (JWT signed with JWT_SECRET, 7d expiry)
       |                                    |
       |<-- 200 { success, user } ----------|
       |    Set-Cookie: admin_token=<JWT>   |
       |    httpOnly, secure(prod), lax     |
       |                                    |
       |-- router.push("/dashboard") ------>|
       |                                    |-- middleware.ts
       |                                    |   (checks admin_token cookie exists)
       |                                    |
       |-- GET /api/auth/session ---------->|
       |                                    |-- verifyToken(token)
       |<-- 200 { authenticated, user } ----|
```

### Token Lifecycle
- **Creation:** On successful login, JWT signed with `UserSession` payload.
- **Storage:** HTTP-only cookie, 7-day lifespan.
- **Verification:** On every protected API call via `verifyToken()`.
- **Invalidation:** Cookie set to empty with `maxAge: 0`. JWT itself is not invalidated -- no server-side revocation list.

---

### 6.2 Middleware Pipeline

| Path Pattern | Middleware | Auth Check |
|---|---|---|
| `/admin/*` | Yes | Cookie presence only |
| `/dashboard/*` | Yes | Cookie presence only |
| `/api/auth/login` | No | N/A (login endpoint) |
| `/api/auth/logout` | No | N/A (clears cookie) |
| `/api/auth/session` | No | Full JWT verification |
| `/api/content/*` | No | Full JWT verification |
| `/api/checkout` | No | No auth required |
| All other routes | No | N/A (public) |

Two-tier authentication: Edge middleware (quick presence check) + API handlers (full JWT verification).

---

### 6.3 Content API -- CRUD Operations

| Operation | Endpoint | Method | Auth | Role | GitHub Sync |
|---|---|---|---|---|---|
| Read | `/api/content?path=...` | GET | Required | None | No |
| Create | `/api/content` | POST | Required | None | Draft branch |
| Update | `/api/content` | PUT | Required | None | Draft branch |
| Delete | `/api/content?path=...` | DELETE | Required | Admin only | **No** |
| List | `/api/content/list?collection=...` | GET | Required | None | No |
| Publish | `/api/content/publish` | POST | Required | Admin only | Merge draft->main |

**Data Consistency Concerns:**
- Deletes are local-only, not synced to GitHub -- creates drift.
- Multi-instance inconsistency (local writes not shared).
- No file locking for concurrent writes.

---

### 6.4 Security Analysis

#### Session Handling
| Aspect | Status |
|---|---|
| Token storage | Good -- HTTP-only cookie |
| Transport security | Conditional -- `secure` flag in production only |
| Token expiry | 7-day, no refresh mechanism |
| Server-side revocation | Missing |

#### Input Validation
| Area | Validation | Concerns |
|---|---|---|
| Login credentials | Presence check only | No rate limiting |
| Content paths | `startsWith("content/")`, no `..`, no `content/admin/` | POST handler missing admin check |
| Content bodies | No validation | Any JSON accepted |
| Checkout items | Non-empty array | No price validation |

#### API Protection Summary

| Endpoint | Auth | Rate Limit | CSRF | Input Validation |
|---|---|---|---|---|
| POST `/api/auth/login` | N/A | None | SameSite only | Minimal |
| POST/GET `/api/auth/logout` | None | N/A | GET vulnerable | N/A |
| GET `/api/auth/session` | JWT | N/A | N/A | N/A |
| GET/PUT/POST/DELETE `/api/content` | JWT | None | SameSite only | Path validation |
| POST `/api/content/publish` | JWT + Admin | None | SameSite only | N/A |
| POST `/api/checkout` | None | None | SameSite only | Minimal |

---

## 7. Admin Dashboard and Content Management

### 7.1 Dashboard Structure

```
/dashboard                  --> Main dashboard (authenticated, server component)
  |
  +-- /dashboard/edit?collection=X&slug=Y  --> Universal editor
  |     |-- collection=settings  --> SettingsEditor
  |     |-- collection=*        --> VisualEditor
  |
  +-- /dashboard/pages          --> Pages list
  +-- /dashboard/products       --> Products list
  +-- /dashboard/programs       --> Programs list
  +-- /dashboard/shop           --> Shop analytics (NO AUTH!)
  +-- /dashboard/media          --> Media library
  +-- /dashboard/publish        --> Publish workflow
  |
  /admin/[[...filename]]        --> TinaCMS fallback
```

---

### 7.2 Dashboard Pages

**Main Dashboard** (`/dashboard/page.tsx`): Card-grid with sections for Content Management, Features (conditional on flags), and Publishing (admin-only).

**Feature flag logic:**
- Shop: opt-in (`=== true`)
- Programs: opt-out (`!== false`, enabled by default)
- Events: opt-out (same pattern)

**Shop Dashboard** (`/dashboard/shop`): **No authentication check** -- any visitor can access. Shows product analytics with stat cards and inventory alerts.

---

### 7.3 VisualEditor

The primary content editor at 1474 lines. Client component.

**Capabilities:**
- Live preview with actual block components
- Responsive preview (Desktop/Tablet/Mobile viewport simulation)
- 18 block types with categorized block picker and sensible defaults
- Inline `contentEditable` title/description
- Block manipulation (add, remove, duplicate, reorder)
- Between-block insertion via "+" buttons
- Context-sensitive form editor panel (384px right panel)
- Array editing for list-based content

**Limitations:**
- No true WYSIWYG -- rich text fields use plain textareas with HTML input
- No image upload integration -- URL-only image fields
- No drag-and-drop (button-based reorder only)
- No undo/redo
- No auto-save
- No dirty state warning on navigation
- No content validation
- Index-based React keys
- E-commerce blocks render placeholders

---

### 7.4 SettingsEditor

Tabbed interface for site-wide configuration:
1. **General**: Site name, tagline, logos
2. **Navigation**: Full menu editor with child items
3. **Theme & Colors**: Color pickers for 5 theme colors, font pairing selector
4. **Contact Info**: Email, phone, address
5. **Social Links**: 6 social media URLs
6. **Layout**: Homepage/navbar/footer variant selection
7. **Features**: Toggle shop/programs/events with shop-specific settings

---

### 7.5 Content Editing Flow

1. Server reads JSON from filesystem via `fs.readFileSync`
2. Content passed as `initialContent` to client editor
3. All edits in-memory via `useState`
4. Manual save sends PUT to `/api/content`
5. No undo/redo, no dirty tracking, no optimistic concurrency

---

### 7.6 Publishing Pipeline

```
[Edit in Dashboard]
       |
       v
[Save] --> Local fs.writeFileSync
       |
       +--> (if GitHub configured) --> GitHub "draft" branch commit
       |
[Publish Page] --> POST /api/content/publish
       |
       v
GitHub Merges API: merge "draft" into "main"
       |
       v
Deployment provider rebuilds site
```

**Current state:** Publish page has `hasGitHub` **hardcoded to `false`**, making the publish button always disabled.

---

### 7.7 Media Management

Read-only browser scanning `public/uploads` and `public/images`. **Copy URL button is non-functional** (onClick in server component). Upload is placeholder ("coming soon"). No integration with content editors.

---

### 7.8 Dead Code: ContentEditor.tsx

The original block editor has been superseded by `VisualEditor.tsx` but remains in the codebase, unreferenced by any page.

---

## 8. Pages and Content Architecture

### 8.1 Data Layer

`src/lib/tina.ts` reads directly from the filesystem using `fs.readFileSync`. Despite being named `tina.ts`, it does NOT use TinaCMS's GraphQL client. It wraps returns in TinaCMS-compatible shapes (`{ data: { siteSettings: ... } }`) for future migration.

---

### 8.2 Three Page Patterns

**1. Home page** -- Custom layout system with 3 variants:

| Feature | Standard | Hero-Full | Minimal |
|---|---|---|---|
| Navbar variant | `floating` | `transparent` | `fixed` |
| Hero height | 60vh | 100vh | Text-only |
| Multi-slide | Yes | Yes | No (first only) |
| Footer variant | default | default | `"minimal"` |

**Critical:** The home page has a **dual content system**. Hero slides come from CMS (`content/home/index.json`), but body sections (stats, programs, testimonial, CTA) are **hardcoded in JSX**. The CMS-defined blocks are never rendered.

**2. Block-based pages** (about, contact, events, gallery, get-involved, programs) -- Uniform pattern: load settings + content, render `PageLayout` wrapping `BlockRenderer`.

**3. Listing pages** (programs index, demo) -- Custom rendering with data from CMS but hardcoded UI structure.

---

### 8.3 Dynamic Routing

**Programs** (`/programs/[slug]`): Uses `generateStaticParams()` from `getAllPrograms()`. Standard BlockRenderer pattern.

Current programs: youth-leadership, adult-education, community-wellness, digital-skills.

---

### 8.4 TinaCMS Schema

4 collections defined: siteSettings, pages, home, products.

**Critical: Pages Collection Format Mismatch** -- TinaCMS declares `format: "mdx"` but all actual content files are `.json`. This breaks the CMS editing experience.

17 block templates defined covering all component types.

---

### 8.5 Content Structure

```
content/
  admin/users.json           <-- Protected from API access
  home/index.json            <-- Protected from deletion
  pages/*.json               <-- Block-based pages
  programs/*.json             <-- Block-based + metadata
  products/*.json             <-- E-commerce product data
  settings/site.json          <-- Protected from deletion
```

---

### 8.6 Page-Specific Edge Cases

1. **Home page dual content**: CMS blocks exist but are never rendered.
2. **Programs navigation hardcoded**: Adding new programs won't update navigation.
3. **Programs icon map**: Only 4 icons mapped; others fall back to `Users`.
4. **Untyped `getHomeContent()`**: Returns `any`.
5. **No ISR/revalidation**: Content changes require full rebuild.
6. **Double data loading**: Hero slide fallback logic duplicated in page and layout.
7. **Contact info in two places**: Block-level and settings-level can drift.
8. **MinimalLayout hardcoded links**: "Learn More" always links to `/about`.

---

## 9. Cross-Cutting Concerns

### 9.1 Dark Mode Implementation

Dark mode is implemented through three independent mechanisms that sometimes conflict:

**Mechanism 1: DarkModeContext + `.dark` class**
- `DarkModeProvider` reads localStorage/system preference, toggles `.dark` class on `<html>`
- Tailwind's `dark:` variant in `globals.css` uses `@custom-variant dark (&:where(.dark, .dark *))`
- Used by most block components and layout components

**Mechanism 2: ThemeProvider inline styles**
- Sets CSS custom properties via `document.documentElement.style.setProperty()`
- Inline styles override `.dark` class CSS rules due to specificity
- **Breaks dark mode** when CMS provides theme colors

**Mechanism 3: `useDarkMode()` context for inline styles**
- ContactInfo, Stats, Timeline use context to apply inline styles
- Creates dependency on DarkModeContext that Tailwind `dark:` would avoid
- Hardcoded hex colors that may diverge from Tailwind theme

**Per-Component Status:**

| Component/Area | Dark Mode Support | Method |
|---|---|---|
| FloatingNavbar | Good | Tailwind `dark:` |
| FixedNavbar | None | Hardcoded `bg-white` |
| TransparentNavbar | None | Hardcoded `bg-white` |
| NavLinks | Hybrid (conflicting) | Inline styles + Tailwind |
| MobileMenu | Good | Tailwind `dark:` |
| All Footers | N/A | Always dark (`bg-gray-900`) |
| Most blocks | Good | Tailwind `dark:` |
| ContactInfo, Stats, Timeline | Different | Inline styles via context |
| CtaBox | None | CSS custom properties only |
| CartDrawer | None | Hardcoded white/gray |
| ProductDetail | None | Hardcoded `text-gray-900` |

### 9.2 Type Safety

**Strengths:**
- `strict: true` in tsconfig
- Well-defined interfaces for products, settings, navigation, users
- Proper use of `as const` assertions
- Discriminated union for cart actions

**Weaknesses:**
- `Block` interface uses `[key: string]: unknown` -- no compile-time block data validation
- `getHomeContent()` returns `any`
- `Product.longDescription` typed as `unknown`
- Type assertions (`as`) used to bridge structurally identical but nominally different types
- Multiple duplicate type definitions (SiteSettings, NavItem/NavigationItem, ShopSettings)
- Content JSON `_template` values not typed as `BlockType`

### 9.3 Performance

**Synchronous I/O:**
All data access functions in `tina.ts`, `products.ts`, and `auth.ts` use `fs.readFileSync`, blocking the Node.js event loop. Acceptable for low traffic but causes latency spikes under load.

**No Caching:**
- Every page render re-reads `content/settings/site.json`
- Every shop page re-reads all product JSON files
- No `React.cache()`, `unstable_cache()`, or in-memory caching
- `layout.tsx` calls `getSiteSettings()` twice per page (metadata + render)

**Bundle Size:**
- `import * as LucideIcons from "lucide-react"` in CardsGrid and Stats imports the entire icon library (100KB+)
- All 17 block components eagerly imported (no code splitting)
- All 11 Google Fonts instantiated in `fonts.ts` at build time (module is unused but if imported, all would load)

**React Performance:**
- Context value objects not memoized in CartProvider and DarkModeProvider
- `itemCount` and `subtotal` computed on every render without `useMemo`
- 11+ components consume DarkModeContext unnecessarily (Tailwind `dark:` would suffice)

### 9.4 Accessibility

**Strengths:**
- `aria-expanded` on FAQ accordion buttons
- `aria-label` on buttons and interactive elements
- `role="dialog"` and `aria-modal` on CartDrawer
- Smooth scroll respects `prefers-reduced-motion`
- `focus-visible` outlines in globals.css

**Weaknesses:**
- No skip-to-content link
- NavLinks dropdowns: no keyboard support (hover-only)
- ImageGallery lightbox: no Escape key, no arrow navigation, no focus trap
- Testimonials carousel: no `aria-live` for auto-advancing content, no pause on hover/focus
- Team social overlay: hover-only, inaccessible on touch/keyboard
- No body scroll lock when MobileMenu is open (background scrolls)
- DarkModeToggle uses template literals instead of `cn()` for className

---

## 10. Issues Summary

All issues found across all 8 domain reviews, consolidated and ranked by severity.

| ID | Severity | Domain | Description |
|---|---|---|---|
| 1 | Critical | Auth/Security | Hardcoded JWT_SECRET fallback (`"your-super-secret-key-change-in-production"`) enables token forgery in misconfigured deployments |
| 2 | Critical | E-Commerce | Checkout API trusts client-submitted prices -- price manipulation vulnerability |
| 3 | Critical | Contexts | ThemeProvider inline styles override dark mode CSS rules for `--color-background` and `--color-text`, breaking dark mode when CMS provides colors |
| 4 | Critical | Pages/CMS | TinaCMS pages collection declares `format: "mdx"` but all files are `.json` -- breaks CMS editing |
| 5 | High | Auth/Security | No rate limiting on login endpoint -- brute-force attacks feasible |
| 6 | High | API | POST content handler missing `content/admin/` path restriction (GET and PUT have it) |
| 7 | High | E-Commerce | No Stripe webhook handler -- no reliable server-side order confirmation |
| 8 | High | E-Commerce | Success page does not validate Stripe session -- cart cleared even without payment |
| 9 | High | E-Commerce | No inventory validation at checkout, no inventory deduction after purchase |
| 10 | High | Dashboard | Shop dashboard (`/dashboard/shop`) has no authentication check |
| 11 | High | Blocks | XSS risk via `dangerouslySetInnerHTML` in 4 components (TextBlock, ImageTextLeft, ImageTextRight, Faq) without sanitization |
| 12 | High | Pages | Home page ignores CMS-managed blocks -- hardcoded JSX children override content |
| 13 | Medium | Auth | No server-side token revocation mechanism -- deleted/changed users retain access for up to 7 days |
| 14 | Medium | API | DELETE does not sync to GitHub -- creates drift between local and remote state |
| 15 | Medium | Layout | Fixed navbar content overlap -- no centralized top padding on `<main>`, each page must handle independently |
| 16 | Medium | Layout | MobileMenu violates React Rules of Hooks with conditional `useCart()` call |
| 17 | Medium | Layout | NavLinks inline styles override TransparentNavbar's `linkClassName` -- transparent-to-opaque text transition broken |
| 18 | Medium | Layout | Non-functional newsletter form in FullFooter (no submit handler) |
| 19 | Medium | Contexts | Context value objects not memoized in CartProvider and DarkModeProvider -- unnecessary consumer re-renders |
| 20 | Medium | Contexts | Dark mode FOUC -- no blocking script to apply dark class before paint |
| 21 | Medium | Contexts | DarkModeContext `localStorage.getItem` not wrapped in try/catch -- crashes if unavailable |
| 22 | Medium | Contexts | No cart data validation on localStorage load -- schema changes can cause runtime errors |
| 23 | Medium | Contexts | No route protection for shop pages when shop is disabled -- `useCart()` crashes |
| 24 | Medium | Blocks | Three different dark mode approaches across blocks (Tailwind `dark:`, inline styles, none) |
| 25 | Medium | Blocks | Content-component key mismatches: `photo` vs `image` (Team), `avatar` vs `image` (Testimonials) |
| 26 | Medium | Blocks | Full Lucide namespace import in CardsGrid and Stats -- 100KB+ bundle impact |
| 27 | Medium | Blocks | Weak `Block` interface (`[key: string]: unknown`) -- no compile-time validation |
| 28 | Medium | E-Commerce | Currency hardcoded to USD in cart and checkout pages (ignores site settings) |
| 29 | Medium | Dashboard | Publish page has `hasGitHub` hardcoded to `false` -- publish button always disabled |
| 30 | Medium | Dashboard | Media library Copy URL button non-functional (onClick in server component) |
| 31 | Medium | Dashboard | "New Page/Product/Program" buttons link to routes that don't exist |
| 32 | Medium | Dashboard | No concurrency control -- simultaneous edits overwrite each other |
| 33 | Medium | Dashboard | Path traversal risk in edit page -- `slug` parameter not sanitized for `..` |
| 34 | Medium | Auth | GET logout endpoint vulnerable to CSRF (`<img src="/api/auth/logout">`) |
| 35 | Medium | Auth | Users.json committed to version control (password hashes exposed) |
| 36 | Medium | Pages | Programs navigation hardcoded -- new programs not auto-added to nav |
| 37 | Medium | Pages | `getHomeContent()` returns untyped `any` |
| 38 | Medium | Core | All data access functions use synchronous `fs.readFileSync` -- blocks event loop |
| 39 | Medium | Core | No caching layer -- every render re-reads files, `getSiteSettings()` called twice per page |
| 40 | Medium | Core | No environment variable validation at startup |
| 41 | Low | Layout | Duplicated `isNavItemActive` function in NavLinks and MobileMenu |
| 42 | Low | Layout | Hardcoded "Get Involved" CTA in all navbar variants |
| 43 | Low | Layout | Hardcoded footer links (privacy, terms, contact, dashboard) |
| 44 | Low | Layout | Admin dashboard link publicly visible in all footers |
| 45 | Low | Layout | No scroll lock when MobileMenu is open |
| 46 | Low | Layout | No keyboard accessibility for NavLinks dropdowns |
| 47 | Low | Layout | DarkModeToggle uses template literals instead of `cn()` |
| 48 | Low | Layout | No `passive: true` on TransparentNavbar scroll listener |
| 49 | Low | Layout | Button ref not forwarded when `href` is provided |
| 50 | Low | Layout | Navigation label used as React key (conflicts if duplicated) |
| 51 | Low | Blocks | ImageGallery lightbox: no keyboard navigation, no focus trap |
| 52 | Low | Blocks | Testimonials auto-advance doesn't reset on manual navigation |
| 53 | Low | Blocks | FAQ max-height clips long answers at 384px |
| 54 | Low | Blocks | Carousel (ImageGallery) has no navigation buttons on desktop |
| 55 | Low | Blocks | Team social overlay is hover-only (inaccessible on touch) |
| 56 | Low | Blocks | ImageTextLeft/Right are nearly identical -- should be unified |
| 57 | Low | Blocks | Array index used as React key in BlockRenderer |
| 58 | Low | Blocks | Testimonials auto-advance no `aria-live` or pause mechanism |
| 59 | Low | E-Commerce | Full Product objects stored in cart -- large localStorage, stale pricing risk |
| 60 | Low | E-Commerce | "Newest" sort does nothing (no date field on Product) |
| 61 | Low | E-Commerce | Variant price override unused despite type definition |
| 62 | Low | E-Commerce | Shipping limited to 4 countries (US, CA, GB, AU) |
| 63 | Low | E-Commerce | No search UI despite `searchProducts()` existing |
| 64 | Low | E-Commerce | `longDescription` not rendered on product detail page |
| 65 | Low | Dashboard | ContentEditor.tsx is dead code (superseded by VisualEditor) |
| 66 | Low | Dashboard | Dual CMS architecture (TinaCMS + custom dashboard) creates user confusion |
| 67 | Low | Dashboard | No undo/redo in editors |
| 68 | Low | Dashboard | No unsaved changes warning on navigation |
| 69 | Low | Dashboard | Raw HTML editing required for rich text |
| 70 | Low | Dashboard | Hardcoded USD in products list `formatPrice` |
| 71 | Low | Core | `src/lib/fonts.ts` entirely unused (dead code) |
| 72 | Low | Core | Multiple dead exports: `defaultNavigation`, `getStripePublishableKey`, `GitHubFile`, auth CRUD functions |
| 73 | Low | Core | Duplicate type definitions: SiteSettings, NavItem/NavigationItem, ShopSettings |
| 74 | Low | Core | `formatPrice` hardcodes `"en-US"` locale for all currencies |
| 75 | Low | Core | Unused `redirect` import in logout route |
| 76 | Low | Pages | MinimalLayout hardcodes "Learn More" link to `/about` |
| 77 | Low | Pages | Programs icon map only maps 4 icons |
| 78 | Low | Pages | No ISR or revalidation configuration |
| 79 | Low | Pages | Redundant hero slide fallback logic in page and layout |
| 80 | Low | Pages | Contact info duplicated in block content and site settings |

---

## 11. Architecture Diagrams

### Overall System Architecture

```
+-------------------------------------------------------------------+
|                        Next.js App Router                          |
+-------------------------------------------------------------------+
|                                                                    |
|  +------------------+    +------------------+   +----------------+ |
|  |   Public Pages   |    | Dashboard/Admin  |   |   API Routes   | |
|  |  (Server Comps)  |    | (Client + Server)|   | (Route Handlers)| |
|  +--------+---------+    +--------+---------+   +-------+--------+ |
|           |                       |                      |         |
|  +--------v---------+    +--------v---------+   +-------v--------+ |
|  |  PageLayout       |    |  VisualEditor   |   |  /api/auth/*   | |
|  |  BlockRenderer    |    |  SettingsEditor  |   |  /api/content/*| |
|  |  HomeLayout       |    |  DashboardHeader |   |  /api/checkout | |
|  +--------+---------+    +------------------+   +-------+--------+ |
|           |                                              |         |
+-------------------------------------------------------------------+
            |                                              |
  +---------v------------+                    +------------v--------+
  |   Component Layer    |                    |    Library Layer     |
  |  - Navbar variants   |                    |  - auth.ts (JWT)    |
  |  - Footer variants   |                    |  - tina.ts (data)   |
  |  - 17 Block types    |                    |  - github.ts (API)  |
  |  - Shop components   |                    |  - stripe.ts (SDK)  |
  |  - UI primitives     |                    |  - products.ts      |
  +----------------------+                    |  - navigation.ts    |
                                              +----------+----------+
                                                         |
                                              +----------v----------+
                                              |   Content Layer      |
                                              |  content/            |
                                              |    settings/site.json|
                                              |    home/index.json   |
                                              |    pages/*.json      |
                                              |    programs/*.json   |
                                              |    products/*.json   |
                                              |    admin/users.json  |
                                              +---------------------+
```

### Provider Hierarchy

```
<html suppressHydrationWarning>
  <body>
    <DarkModeProvider>          -- Outermost: dark mode class on <html>
      <ThemeProvider>           -- CSS custom properties on documentElement
        <CartProvider>          -- Conditional (shop-enabled only)
          {children}
          <CartDrawer />
        </CartProvider>
      </ThemeProvider>
    </DarkModeProvider>
  </body>
</html>
```

### Content Pipeline

```
[CMS/JSON Config] -> SiteSettings -> PageLayout
                                       |
                         +--------------+--------------+
                         |              |              |
                    Navbar(factory)   <main>     Footer(factory)
                         |                             |
              +----------+----------+       +----------+----------+
              |          |          |       |          |          |
          Floating   Fixed   Transparent  Full    Centered   Minimal
```

### Block Rendering Pipeline

```
content/pages/*.json  -->  getPageContent(slug)  -->  PageContent.blocks[]
                                                            |
                                                            v
                                                    BlockRenderer
                                                            |
                                                     switch(_template)
                                                            |
              +-------+-------+-------+-------+-------+----+----+
              |       |       |       |       |       |         |
          TextBlock  Hero  ImageText Cards   Faq   Stats  ... (17 total)
```

### E-Commerce Flow

```
/shop (Server)  -->  ShopPageClient (Client)  -->  ProductCard
                                                       |
                                                       v
                                               /shop/[slug] (Server)
                                                       |
                                                       v
                                              ProductDetail (Client)
                                                       |
                                               AddToCartButton
                                                       |
                                                CartContext
                                                       |
                                              CartDrawer / CartPage
                                                       |
                                                   /shop/checkout
                                                       |
                                              POST /api/checkout
                                                       |
                                            Stripe Checkout Session
                                                       |
                                              /shop/success
```

### Draft/Publish Workflow

```
[Edit in Dashboard]
       |
       v
[Save] --> Local fs.writeFileSync
       |
       +--> (if GitHub configured) --> GitHub "draft" branch commit
       |
[Publish Page] --> POST /api/content/publish
       |
       v
GitHub Merges API: merge "draft" into "main"
       |
       v
Deployment provider detects main push --> Rebuilds site
```

---

*This architectural review was compiled from 8 independent domain analyses covering the entire site-template codebase. It identifies 80 issues across all domains, with 4 critical, 8 high, 28 medium, and 40 low severity findings.*
