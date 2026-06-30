import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Defend the Forge | Numinous Designs",
  description:
    "Play Defend the Forge — an arcade-style browser game where you protect the Numinous workshop from waves of creative chaos.",
  alternates: {
    canonical: "/game",
  },
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
