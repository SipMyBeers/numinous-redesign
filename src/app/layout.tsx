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
  icons: {
    icon: "/images/branding/favicon.png",
    apple: "/images/branding/favicon.png",
  },
  openGraph: {
    title: "Numinous Designs | Creative Fabrication & Design Studio",
    description:
      "We transform bold ideas into tangible art and environments that evoke emotion, engage the senses, and connect people to story, space, and each other.",
    siteName: "Numinous Designs",
    type: "website",
    images: ["/images/branding/favicon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Numinous Designs | Creative Fabrication & Design Studio",
    description:
      "We transform bold ideas into tangible art and environments that evoke emotion, engage the senses, and connect people to story, space, and each other.",
    images: ["/images/branding/favicon.png"],
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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
