import type { TemplateSettings, SiteSettings } from "./tina";

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const defaultNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Programs",
    href: "/programs",
    children: [
      { label: "Youth Leadership", href: "/programs/youth-leadership" },
      { label: "Adult Education", href: "/programs/adult-education" },
      { label: "Community Wellness", href: "/programs/community-wellness" },
      { label: "Digital Skills", href: "/programs/digital-skills" },
    ],
  },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];

/**
 * Generate dynamic navigation based on template settings
 * If custom navigation is defined in settings, use that instead
 */
export function getNavigation(template?: TemplateSettings, settings?: SiteSettings): NavItem[] {
  // If custom navigation is defined in settings, use it
  const customNav = settings?.navigation as NavItem[] | undefined;
  if (customNav && customNav.length > 0) {
    return customNav;
  }

  // Otherwise, generate navigation based on feature flags
  const baseNav: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  // Add Programs if enabled (default for organization template)
  if (template?.features?.programs?.enabled !== false) {
    baseNav.push({
      label: "Programs",
      href: "/programs",
      children: [
        { label: "Youth Leadership", href: "/programs/youth-leadership" },
        { label: "Adult Education", href: "/programs/adult-education" },
        { label: "Community Wellness", href: "/programs/community-wellness" },
        { label: "Digital Skills", href: "/programs/digital-skills" },
      ],
    });
  }

  // Add Shop if enabled
  if (template?.features?.shop?.enabled) {
    baseNav.push({ label: "Shop", href: "/shop" });
  }

  // Add Events if enabled
  if (template?.features?.events?.enabled !== false) {
    baseNav.push({ label: "Events", href: "/events" });
  }

  // Standard pages
  baseNav.push(
    { label: "Gallery", href: "/gallery" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "Contact", href: "/contact" }
  );

  return baseNav;
}

/**
 * Check if shop feature is enabled
 */
export function isShopEnabled(template?: TemplateSettings): boolean {
  return template?.features?.shop?.enabled === true;
}
