import {
  Plus_Jakarta_Sans,
  Inter,
  Playfair_Display,
  Source_Sans_3,
  Montserrat,
  Open_Sans,
  Nunito,
  Lato,
  Raleway,
  Roboto,
  Cormorant_Garamond,
} from "next/font/google";

// Font instances
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

// Font pairing definitions
export const fontPairings = {
  modern: {
    heading: plusJakartaSans,
    body: inter,
    name: "Modern",
    description: "Plus Jakarta Sans + Inter",
  },
  classic: {
    heading: playfairDisplay,
    body: sourceSans,
    name: "Classic",
    description: "Playfair Display + Source Sans Pro",
  },
  clean: {
    heading: montserrat,
    body: openSans,
    name: "Clean",
    description: "Montserrat + Open Sans",
  },
  friendly: {
    heading: nunito,
    body: lato,
    name: "Friendly",
    description: "Nunito + Lato",
  },
  professional: {
    heading: raleway,
    body: roboto,
    name: "Professional",
    description: "Raleway + Roboto",
  },
  elegant: {
    heading: cormorantGaramond,
    body: inter, // Using Inter as fallback since Proza Libre isn't in next/font
    name: "Elegant",
    description: "Cormorant Garamond + Inter",
  },
} as const;

export type FontPairingKey = keyof typeof fontPairings;

export function getFontClasses(pairing: FontPairingKey = "modern"): string {
  const fonts = fontPairings[pairing];
  return `${fonts.heading.variable} ${fonts.body.variable}`;
}
