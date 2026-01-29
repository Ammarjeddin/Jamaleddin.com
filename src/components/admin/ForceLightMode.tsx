"use client";

import { useEffect, useRef } from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

/**
 * Forces light mode while mounted by setting dark mode to false via context.
 * Restores the previous dark mode state on unmount.
 * Used in admin pages that don't have dark mode styling.
 */
export function ForceLightMode() {
  const { isDarkMode, setDarkMode } = useDarkMode();
  const wasDarkRef = useRef<boolean | null>(null);

  useEffect(() => {
    // On first effect where isDarkMode has been initialized,
    // capture the state and force light mode
    if (wasDarkRef.current === null) {
      wasDarkRef.current = isDarkMode;
    }

    if (isDarkMode) {
      setDarkMode(false);
    }
  }, [isDarkMode, setDarkMode]);

  useEffect(() => {
    return () => {
      // Restore dark mode on unmount if it was active before
      if (wasDarkRef.current) {
        // Use direct DOM manipulation for cleanup since context
        // may not process state updates during unmount
        document.documentElement.classList.add("dark");
        try {
          localStorage.setItem("site-template-dark-mode", "true");
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return null;
}
