import Script from "next/script";

// Organization Schema
export interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  email?: string;
  telephone?: string;
  sameAs?: string[];
}

export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  address,
  email,
  telephone,
  sameAs,
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo: logo.startsWith("http") ? logo : `${url}${logo}`,
    description,
    ...(address && {
      address: {
        "@type": "PostalAddress",
        ...(address.streetAddress && { streetAddress: address.streetAddress }),
        ...(address.addressLocality && { addressLocality: address.addressLocality }),
        ...(address.addressRegion && { addressRegion: address.addressRegion }),
        ...(address.postalCode && { postalCode: address.postalCode }),
        ...(address.addressCountry && { addressCountry: address.addressCountry }),
      },
    }),
    ...(email && { email }),
    ...(telephone && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone,
        contactType: "customer service",
        email,
      },
    }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

// Service Schema
export interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  provider: {
    name: string;
    url: string;
  };
  image?: string;
  areaServed?: string;
  serviceType?: string;
  category?: string;
}

export function ServiceSchema({
  name,
  description,
  url,
  provider,
  image,
  areaServed,
  serviceType,
  category,
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: provider.name,
      url: provider.url,
    },
    ...(image && { image: image.startsWith("http") ? image : `${provider.url}${image}` }),
    ...(areaServed && { areaServed }),
    ...(serviceType && { serviceType }),
    ...(category && { category }),
  };

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

// Generic JSON-LD component for custom schemas
export interface JsonLdProps {
  id: string;
  schema: Record<string, unknown>;
}

export function JsonLd({ id, schema }: JsonLdProps) {
  const schemaWithContext = {
    "@context": "https://schema.org",
    ...schema,
  };

  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWithContext) }}
      strategy="afterInteractive"
    />
  );
}
