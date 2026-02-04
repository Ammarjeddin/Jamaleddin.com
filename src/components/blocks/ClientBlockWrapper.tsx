"use client";

import { useState, type ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { BlockErrorFallback } from "@/components/ui/BlockErrorFallback";

interface ClientBlockWrapperProps {
  children: ReactNode;
  blockType: string;
  index: number;
}

/**
 * Client-side wrapper that provides error boundary protection for blocks.
 * This is a client component so it can use error boundaries with state.
 */
export function ClientBlockWrapper({ children, blockType, index }: ClientBlockWrapperProps) {
  const [resetKey, setResetKey] = useState(0);

  const handleRetry = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <ErrorBoundary
      key={resetKey}
      fallback={<BlockErrorFallback blockType={blockType} onRetry={handleRetry} />}
      onError={(error) => {
        console.error(`[BlockRenderer] Error in block "${blockType}" at index ${index}:`, error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
