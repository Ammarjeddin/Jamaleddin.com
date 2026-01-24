"use client";

import { useTina } from "tinacms/dist/react";

export interface SiteSettings {
  siteName: string;
  tagline?: string;
  logo?: {
    main?: string;
    icon?: string;
    light?: string;
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  fonts?: {
    pairing?: string;
  };
  layout?: {
    homepage?: string;
    navbar?: string;
    footer?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    plausibleDomain?: string;
  };
  seo?: {
    titleTemplate?: string;
    defaultDescription?: string;
    defaultOgImage?: string;
  };
}

interface UseSiteSettingsProps {
  query: string;
  variables: Record<string, unknown>;
  data: {
    siteSettings: SiteSettings;
  };
}

export function useSiteSettings(props: UseSiteSettingsProps) {
  const { data } = useTina(props);
  return data.siteSettings;
}
