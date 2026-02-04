"use client";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import type { ElementType } from "react";

interface SafeHtmlProps {
  html: string;
  className?: string;
  as?: ElementType;
}

/**
 * SafeHtml component that sanitizes HTML content before rendering
 * Use this instead of dangerouslySetInnerHTML to prevent XSS attacks
 */
export function SafeHtml({ html, className, as: Component = "div" }: SafeHtmlProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    // DOMPurify only works in browser environment
    if (typeof window !== "undefined") {
      setSanitizedHtml(
        DOMPurify.sanitize(html, {
          USE_PROFILES: { html: true },
          ALLOWED_TAGS: [
            "p", "br", "strong", "em", "b", "i", "u", "s",
            "h1", "h2", "h3", "h4", "h5", "h6",
            "ul", "ol", "li",
            "a", "span", "div",
            "blockquote", "code", "pre",
          ],
          ALLOWED_ATTR: ["href", "target", "rel", "class", "id"],
          ADD_ATTR: ["target"], // Allow target attribute for links
        })
      );
    }
  }, [html]);

  // Server-side: render empty, client will hydrate
  if (!sanitizedHtml) {
    return <Component className={className} />;
  }

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
