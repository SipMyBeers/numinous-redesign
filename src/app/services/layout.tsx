import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Numinous Designs",
  description:
    "From concept design and 3D modeling to precision metal fabrication, consulting, and event production — Numinous Designs brings bold visions to life.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
