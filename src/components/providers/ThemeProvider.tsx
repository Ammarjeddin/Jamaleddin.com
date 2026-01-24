"use client";

import { useEffect } from "react";
import type { SiteSettings } from "@/lib/hooks/useSiteSettings";

interface ThemeProviderProps {
  children: React.ReactNode;
  settings: SiteSettings;
}

export function ThemeProvider({ children, settings }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;

    if (settings?.theme) {
      const { primaryColor, secondaryColor, accentColor, backgroundColor, textColor } =
        settings.theme;

      if (primaryColor) {
        root.style.setProperty("--color-primary", primaryColor);
        // Generate lighter/darker variants
        root.style.setProperty("--color-primary-light", adjustColor(primaryColor, 20));
        root.style.setProperty("--color-primary-dark", adjustColor(primaryColor, -20));
      }
      if (secondaryColor) {
        root.style.setProperty("--color-secondary", secondaryColor);
        root.style.setProperty("--color-secondary-light", adjustColor(secondaryColor, 20));
        root.style.setProperty("--color-secondary-dark", adjustColor(secondaryColor, -20));
      }
      if (accentColor) {
        root.style.setProperty("--color-accent", accentColor);
        root.style.setProperty("--color-accent-light", adjustColor(accentColor, 20));
        root.style.setProperty("--color-accent-dark", adjustColor(accentColor, -20));
      }
      if (backgroundColor) {
        root.style.setProperty("--color-background", backgroundColor);
      }
      if (textColor) {
        root.style.setProperty("--color-text", textColor);
        root.style.setProperty("--color-text-muted", adjustColor(textColor, 40));
      }
    }
  }, [settings]);

  return <>{children}</>;
}

// Helper function to lighten or darken a hex color
function adjustColor(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Adjust each channel
  r = Math.min(255, Math.max(0, r + (percent / 100) * 255));
  g = Math.min(255, Math.max(0, g + (percent / 100) * 255));
  b = Math.min(255, Math.max(0, b + (percent / 100) * 255));

  // Convert back to hex
  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
}
