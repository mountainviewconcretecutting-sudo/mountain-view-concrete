import type { Metadata, Viewport } from "next";
import { Oswald, Work_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallBar from "@/components/StickyCallBar";

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
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#1E2022",
  width: "device-width",
  initialScale: 1,
};

import { EditModeProvider } from "@/components/edit-mode/EditModeContext";
import { getIsAdmin } from "@/lib/actions/siteContent";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await getIsAdmin();

  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${workSans.variable} ${jetbrainsMono.variable} font-body`}
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
