"use client";

import Image from "next/image";
import { useDarkModeSafe } from "@/contexts/DarkModeContext";

interface NavbarLogoProps {
  mainLogo?: string;
  darkLogo?: string;
  siteName: string;
  size?: number;
}

export function NavbarLogo({ mainLogo, darkLogo, siteName, size = 40 }: NavbarLogoProps) {
  const darkModeContext = useDarkModeSafe();
  const isDarkMode = darkModeContext?.isDarkMode ?? false;

  // If no logos provided, show text
  if (!mainLogo) {
    return (
      <span className="text-xl font-bold text-[var(--color-primary)] dark:text-slate-100">
        {siteName}
      </span>
    );
  }

  // If we have a dark logo, show both and toggle visibility with CSS
  if (darkLogo) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Image
          src={mainLogo}
          alt={siteName}
          width={size}
          height={size}
          className={`h-10 w-auto transition-opacity ${isDarkMode ? 'hidden' : 'block'}`}
        />
        <Image
          src={darkLogo}
          alt={siteName}
          width={size}
          height={size}
          className={`h-10 w-auto transition-opacity ${isDarkMode ? 'block' : 'hidden'}`}
        />
        {/* Company name wordmark - use higher resolution for crisp rendering */}
        <Image
          src="/images/logoWord.png"
          alt={`${siteName} wordmark`}
          width={400}
          height={48}
          quality={100}
          priority
          className="h-5 sm:h-6 w-auto"
        />
      </div>
    );
  }

  // Only main logo available
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Image
        src={mainLogo}
        alt={siteName}
        width={size}
        height={size}
        className="h-10 w-auto"
      />
      {/* Company name wordmark - use higher resolution for crisp rendering */}
      <Image
        src="/images/logoWord.png"
        alt={`${siteName} wordmark`}
        width={400}
        height={48}
        quality={100}
        priority
        className="h-5 sm:h-6 w-auto"
      />
    </div>
  );
}
