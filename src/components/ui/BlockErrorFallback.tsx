"use client";

import React from "react";

interface BlockErrorFallbackProps {
  blockType?: string;
  onRetry?: () => void;
}

/**
 * A compact error fallback component designed specifically for content blocks.
 * Displays a subtle error message without disrupting the page layout.
 */
export function BlockErrorFallback({ blockType, onRetry }: BlockErrorFallbackProps) {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-lg border border-red-500/10 bg-[var(--color-bg-secondary)]/50 p-6 text-center">
          <div className="mb-3 flex justify-center">
            <svg
              className="h-6 w-6 text-red-400/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <p className="mb-1 text-sm font-medium text-[var(--color-text)]">
            Unable to load this section
          </p>
          {blockType && (
            <p className="mb-4 text-xs text-[var(--color-text-secondary)]">
              Block type: {blockType}
            </p>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-primary)]/30 bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Try again
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default BlockErrorFallback;
