import type { Metadata, Viewport } from "next";
import { Teko, Barlow, Chakra_Petch, Oswald, Work_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallBar from "@/components/StickyCallBar";

const teko = Teko({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-teko",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-worksans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const SITE_URL = "https://mountainviewconcretecutting.ca";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mountain View Concrete Cutting Inc. | Calgary & Western Alberta",
    template: "%s | Mountain View Concrete Cutting Inc.",
  },
  description:
    "Precision Cutting. Solid Results. 25+ years of concrete cutting, core drilling, and demolition services for residential, commercial, and industrial projects across Calgary and Western Alberta. 24/7 emergency service.",
  keywords: [
    "concrete cutting Calgary",
    "core drilling Alberta",
    "slab sawing",
    "wall sawing",
    "concrete demolition Calgary",
  ],
  openGraph: {
    title: "Mountain View Concrete Cutting Inc.",
    description: "Precision Cutting. Solid Results. Serving Calgary & Western Alberta, 24/7.",
    url: SITE_URL,
    siteName: "Mountain View Concrete Cutting Inc.",
    locale: "en_CA",
    type: "website",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E2022",
  width: "device-width",
  initialScale: 1,
};

import { EditModeProvider } from "@/components/edit-mode/EditModeContext";
import { getIsAdmin } from "@/lib/actions/siteContent";
import { getThemeSettings } from "@/lib/actions/theme";
import { hexToRgbChannels } from "@/lib/utils/colors";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, theme] = await Promise.all([
    getIsAdmin(),
    getThemeSettings(),
  ]);

  // Build the CSS custom properties string from theme values.
  // Colors are stored as hex in the DB but CSS vars need RGB channels so that
  // Tailwind opacity modifiers (bg-orange/30, charcoal/95, etc.) work correctly.
  const cssVars = [
    `--color-orange: ${hexToRgbChannels(theme.color_orange ?? "#E85D04")};`,
    `--color-orange-hover: ${hexToRgbChannels(theme.color_orange_hover ?? "#C94E02")};`,
    `--color-orange-soft: ${hexToRgbChannels(theme.color_orange_soft ?? "#FDECDF")};`,
    `--color-charcoal: ${hexToRgbChannels(theme.color_charcoal ?? "#1E2022")};`,
    `--color-charcoal-soft: ${hexToRgbChannels(theme.color_charcoal_soft ?? "#2A2D30")};`,
    `--color-charcoal-hard: ${hexToRgbChannels(theme.color_charcoal_hard ?? "#141516")};`,
  ].join("\n    ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "GeneralContractor"],
    name: "Mountain View Concrete Cutting Inc.",
    legalName: "2549952 Alberta Inc.",
    url: SITE_URL,
    telephone: "825-734-1419",
    email: "crafuse0@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "3904 3A Street NE",
      addressLocality: "Calgary",
      addressRegion: "AB",
      postalCode: "T2E 6R4",
      addressCountry: "CA",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Calgary" },
      { "@type": "AdministrativeArea", name: "Airdrie" },
      { "@type": "AdministrativeArea", name: "Okotoks" },
      { "@type": "AdministrativeArea", name: "Chestermere" },
      { "@type": "AdministrativeArea", name: "Cochrane" },
      { "@type": "AdministrativeArea", name: "Western Alberta" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "emergency",
      telephone: "825-734-1419",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
      areaServed: "Calgary and Western Alberta",
      availableLanguage: "English",
    },
    knowsAbout: [
      "Wall Sawing",
      "Slab Sawing",
      "Core Drilling",
      "Concrete Demolition & Removal",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme CSS custom properties — sourced from theme_settings table */}
        <style dangerouslySetInnerHTML={{ __html: `:root {\n    ${cssVars}\n  }` }} />
        {/* LocalBusiness / GeneralContractor JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${teko.variable} ${barlow.variable} ${chakraPetch.variable} ${oswald.variable} ${workSans.variable} ${jetbrainsMono.variable} font-body bg-aggregate text-chalk selection:bg-flame selection:text-white`}
      >
        <EditModeProvider isAdmin={isAdmin}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-2 focus:rounded focus:bg-orange focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <StickyCallBar />
        </EditModeProvider>
      </body>
    </html>
  );
}
