import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Numinous Designs",
  description:
    "Answers to common questions about working with Numinous Designs — from design-only projects to full fabrication, consulting, and studio visits.",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
