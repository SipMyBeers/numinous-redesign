import type { Metadata } from "next";
import { Inter, Urbanist, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://numinousdesigns.com"),
  title: "Numinous Designs | Creative Fabrication & Design Studio",
  description:
    "We transform bold ideas into tangible art and environments that evoke emotion, engage the senses, and connect people to story, space, and each other.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/images/branding/favicon.png",
    apple: "/images/branding/favicon.png",
  },
  openGraph: {
    title: "Numinous Designs | Creative Fabrication & Design Studio",
    description:
      "We transform bold ideas into tangible art and environments that evoke emotion, engage the senses, and connect people to story, space, and each other.",
    url: "/",
    siteName: "Numinous Designs",
    type: "website",
    images: [
      {
        url: "/images/hero/numinous-hero.png",
        width: 2500,
        height: 1667,
        alt: "Numinous Designs creative fabrication studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Numinous Designs | Creative Fabrication & Design Studio",
    description:
      "We transform bold ideas into tangible art and environments that evoke emotion, engage the senses, and connect people to story, space, and each other.",
    images: ["/images/hero/numinous-hero.png"],
  },
};

// Organization structured data — facts only (Santa Cruz HQ, principal artist).
// No street address / phone / hours fabricated. Upgrade to LocalBusiness once a
// verified address + phone exist for stronger local-search rich results.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Numinous Designs",
  url: "https://numinousdesigns.com",
  logo: "https://numinousdesigns.com/images/branding/logo-full.png",
  description:
    "Creative fabrication and design studio building monumental sculpture, fire installations, and large-scale public art.",
  founder: {
    "@type": "Person",
    name: "Orion Fredericks",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Santa Cruz",
    addressRegion: "CA",
    addressCountry: "US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${urbanist.variable} ${caveat.variable}`}>
      <body className="bg-numinous-black text-white font-body" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
