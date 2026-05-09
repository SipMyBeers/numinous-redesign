import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Numinous Designs",
  description:
    "Meet the team behind Numinous Designs — artists, engineers, and fabricators headquartered in Santa Cruz, CA with satellite studios across the U.S.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
