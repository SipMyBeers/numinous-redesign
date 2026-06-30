import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Numinous Designs",
  description:
    "Explore our portfolio of monumental stainless steel sculptures, immersive fire installations, and large-scale public art pieces crafted by Numinous Designs.",
  alternates: {
    canonical: "/portfolio",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
