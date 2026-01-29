"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

const STORAGE_KEY = "site-template-dark-mode";

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage and system preference
  useEffect(() => {
    setMounted(true);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsDarkMode(stored === "true");
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(prefersDark);
      }
    } catch {
      // localStorage may be unavailable in private browsing or restricted environments
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (!mounted) return;

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    try {
      localStorage.setItem(STORAGE_KEY, isDarkMode.toString());
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [isDarkMode, mounted]);

  const toggleDarkMode = useCallback(() => setIsDarkMode((prev) => !prev), []);
  const setDarkMode = useCallback((value: boolean) => setIsDarkMode(value), []);

  const value = useMemo(
    () => ({ isDarkMode, toggleDarkMode, setDarkMode }),
    [isDarkMode, toggleDarkMode, setDarkMode]
  );

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
 * Safe version of useDarkMode that returns null when DarkModeProvider is absent.
 * Use this in components that may render outside of DarkModeProvider.
 */
export function useDarkModeSafe(): DarkModeContextType | null {
  return useContext(DarkModeContext) ?? null;
}
