import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebGL Showcase | Numinous Designs",
  description:
    "A real-time WebGL shader demo from the Numinous Designs studio.",
  alternates: {
    canonical: "/showcase",
  },
};

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
