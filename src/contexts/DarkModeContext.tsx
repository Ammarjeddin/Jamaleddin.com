"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

/**
 * DarkModeProvider - DARK MODE ONLY
 * This site uses dark mode exclusively. The context is kept for API compatibility
 * but all toggle/set operations are no-ops.
 */
export function DarkModeProvider({ children }: { children: ReactNode }) {
  // Ensure dark class is always present
  useEffect(() => {
    document.documentElement.classList.add("dark");
    // Remove any light mode artifacts from localStorage
    try {
      localStorage.removeItem("site-template-dark-mode");
    } catch {
      // Silently fail
    }
  }, []);

  // Fixed dark mode value - no toggling allowed
  const value: DarkModeContextType = {
    isDarkMode: true,
    toggleDarkMode: () => {
      // No-op: dark mode only
    },
    setDarkMode: () => {
      // No-op: dark mode only
    },
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode(): DarkModeContextType {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
}

/**
 * Safe version of useDarkMode that returns a default dark mode state
 * when DarkModeProvider is absent.
 */
export function useDarkModeSafe(): DarkModeContextType {
  const context = useContext(DarkModeContext);
  return context ?? {
    isDarkMode: true,
    toggleDarkMode: () => {},
    setDarkMode: () => {},
  };
}
