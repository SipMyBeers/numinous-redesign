"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GlowCard from "@/components/ui/GlowCard";
import { pieces } from "./pieces";

const PlanetScene = dynamic(
  () => import("@/components/three/PlanetScene"),
  { ssr: false }
);

export default function PortfolioPage() {
  const [selected, setSelected] = useState<(typeof pieces)[0] | null>(null);

  // Auto-open lightbox if piece query param is present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pieceId = params.get("piece");
    if (pieceId) {
      const found = pieces.find((p) => p.id === pieceId);
      if (found) setSelected(found);
    }
  }, []);

  const sculptures = pieces.filter((p) => p.category !== "Functional Design");
  const functional = pieces.filter((p) => p.category === "Functional Design");

  const renderCard = (piece: (typeof pieces)[number], i: number) => (
    <motion.div
      key={piece.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
    >
      <GlowCard className="group cursor-pointer">
        <div
          onClick={() => setSelected(piece)}
          className="relative aspect-[4/5] overflow-hidden"
        >
          <Image
            src={piece.image}
            alt={piece.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-numinous-black via-numinous-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <p className="text-[10px] tracking-[0.3em] uppercase text-numinous-ember mb-2">
              {piece.category}
            </p>
            <h3 className="text-xl font-heading font-semibold mb-1">
              {piece.name}
            </h3>
            <p className="text-sm text-white/40">
              {piece.material}
              {piece.year && ` · ${piece.year}`}
            </p>
          </div>

          {/* Hover line */}
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-numinous-ember transition-all duration-500 group-hover:w-full" />
        </div>
      </GlowCard>
    </motion.div>
  );

  return (
    <>
      <PlanetScene />

      <div className="relative z-10 pt-32 pb-20 min-h-screen">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <ScrollReveal>
            <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-4">
              Our Work
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
              Portfolio
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-lg text-white/50 max-w-2xl">
              From monumental stainless steel sculptures to immersive fire
              installations, each piece tells a story of craft, vision, and
              transformation.
            </p>
          </ScrollReveal>
        </section>

        {/* Grid — Sculptures & Installations */}
        <section className="max-w-7xl mx-auto px-6">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sculptures.map((piece, i) => renderCard(piece, i))}
          </motion.div>
        </section>

        {/* ===== Section break: Functional Design (Jason Davoli) ===== */}
        {functional.length > 0 && (
          <>
            <section className="max-w-7xl mx-auto px-6 mt-32 mb-14">
              <ScrollReveal>
                <div className="flex items-center gap-5">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-numinous-ember/40" />
                  <p className="text-[11px] tracking-[0.45em] uppercase text-numinous-ember whitespace-nowrap">
                    Functional Design
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-numinous-ember/40" />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <h2 className="mt-8 text-3xl md:text-5xl font-heading font-bold text-center">
                  Furniture &amp; Fabrication
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <p className="mt-4 text-base text-white/45 max-w-2xl mx-auto text-center leading-relaxed">
                  Custom furniture and architectural metalwork by Jason Davoli of
                  JDavoliDesign — our New York lead.
                </p>
              </ScrollReveal>
            </section>

            <section className="max-w-7xl mx-auto px-6">
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {functional.map((piece, i) => renderCard(piece, i))}
              </motion.div>
            </section>
          </>
        )}

        {/* Client & Partner Logos */}
        <section className="max-w-7xl mx-auto px-6 mt-20">
          <ScrollReveal>
            <h2 className="text-2xl font-heading font-semibold mb-4 text-white/60">
              Trusted By
            </h2>
            <p className="text-sm text-white/30 mb-10">
              Clients and collaborators we&apos;ve had the privilege to work with.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "/images/portfolio/page0_1.png",
              "/images/portfolio/page0_4.png",
              "/images/portfolio/page2_2.png",
              "/images/portfolio/page3_0.png",
              "/images/portfolio/page4_2.png",
              "/images/portfolio/page4_3.png",
              "/images/portfolio/page5_0.png",
              "/images/portfolio/page5_1.png",
              "/images/portfolio/page5_2.png",
              "/images/portfolio/page5_3.png",
              "/images/portfolio/page5_4.png",
              "/images/portfolio/page3_1.png",
            ].map((src, i) => (
              <ScrollReveal key={src} delay={i * 0.05}>
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-white/5 border border-white/5 flex items-center justify-center p-4 group hover:bg-white/10 hover:border-numinous-ember/20 transition-all duration-300">
                  <Image
                    src={src}
                    alt={`Client logo ${i + 1}`}
                    fill
                    className="object-contain p-3 brightness-0 invert opacity-60 group-hover:opacity-100 transition-all duration-300"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-numinous-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute -top-2 -right-2 md:-top-4 md:-right-4 z-10 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-numinous-charcoal/90 border border-white/15 text-white/70 hover:text-numinous-ember hover:border-numinous-ember transition-colors duration-200 backdrop-blur-sm"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-numinous-charcoal">
                <Image
                  src={selected.image}
                  alt={selected.name}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] tracking-[0.3em] uppercase text-numinous-ember mb-3">
                  {selected.category}
                </p>
                <h2 className="text-4xl font-heading font-bold mb-4">
                  {selected.name}
                </h2>
                <p className="text-white/50 leading-relaxed mb-6">
                  {selected.description}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/30 mb-4">
                  <span>
                    <strong className="text-white/60">Material:</strong>{" "}
                    {selected.material}
                  </span>
                  {selected.year && (
                    <span>
                      <strong className="text-white/60">Year:</strong>{" "}
                      {selected.year}
                    </span>
                  )}
                  {selected.dimensions && (
                    <span>
                      <strong className="text-white/60">Dimensions:</strong>{" "}
                      {selected.dimensions}
                    </span>
                  )}
                </div>
                {selected.availability && (
                  <p className="text-xs tracking-widest uppercase text-numinous-ember mb-6">
                    {selected.availability}
                  </p>
                )}

                <button
                  onClick={() => setSelected(null)}
                  className="self-start px-6 py-2 border border-white/20 text-white/60 text-sm tracking-widest uppercase hover:border-numinous-ember hover:text-numinous-ember transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
