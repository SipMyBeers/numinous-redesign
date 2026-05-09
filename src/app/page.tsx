"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import dynamic from "next/dynamic";
import TextReveal from "@/components/ui/TextReveal";
import ImageReveal from "@/components/ui/ImageReveal";
import HorizontalGallery from "@/components/ui/HorizontalGallery";
import MagneticButton from "@/components/ui/MagneticButton";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FlameBackground from "@/components/ui/FlameBackground";
import VideoPlayer from "@/components/ui/VideoPlayer";



const laserBeams = [
  { maxAngle: -75, color: "#4a9ebe", wobble: 3, dur: 2.5 },
  { maxAngle: -55, color: "#a855f7", wobble: 4, dur: 3.2 },
  { maxAngle: -38, color: "#22c55e", wobble: 2.5, dur: 2.8 },
  { maxAngle: -22, color: "#e8d44d", wobble: 3.5, dur: 3.5 },
  { maxAngle: -8, color: "#60b5ff", wobble: 2, dur: 4 },
  { maxAngle: 8, color: "#f43f5e", wobble: 3, dur: 2.2 },
  { maxAngle: 22, color: "#4a9ebe", wobble: 4.5, dur: 3 },
  { maxAngle: 38, color: "#e8d44d", wobble: 2, dur: 3.8 },
  { maxAngle: 55, color: "#a855f7", wobble: 3, dur: 2.5 },
  { maxAngle: 75, color: "#22c55e", wobble: 3.5, dur: 4.2 },
];

function LaserShow({ spread }: { spread: number }) {
  const s = spread;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Origin glow at bottom center */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
        style={{
          background: "#fff",
          boxShadow: `0 0 20px 8px rgba(255,255,255,${0.3 + s * 0.5}), 0 0 60px 20px rgba(100,180,255,${0.2 + s * 0.3})`,
          opacity: Math.min(1, s * 3),
        }}
      />

      {/* Laser beams fanning out from bottom center */}
      {laserBeams.map((beam, i) => {
        const angle = beam.maxAngle * s;
        const opacity = Math.min(0.7, s * 1.5);
        return (
          <motion.div
            key={i}
            animate={{ rotate: [angle - beam.wobble, angle + beam.wobble] }}
            transition={{ duration: beam.dur, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute bottom-0 left-1/2"
            style={{
              width: "1.5px",
              height: "120%",
              transformOrigin: "bottom center",
              background: `linear-gradient(to top, ${beam.color}, ${beam.color}80 30%, transparent 85%)`,
              boxShadow: `0 0 6px 1px ${beam.color}60, 0 0 15px 3px ${beam.color}30`,
              opacity,
            }}
          />
        );
      })}

      {/* Orbs shooting outward along each beam direction */}
      {laserBeams.flatMap((beam, i) =>
        [0, 1, 2].map((j) => {
          const angle = beam.maxAngle * s;
          const dur = 1.8 + j * 0.6;
          const delay = i * 0.3 + j * 0.7;
          const size = 3 - j * 0.5;
          return (
            <div
              key={`spark-${i}-${j}`}
              className="absolute bottom-0 left-1/2 pointer-events-none"
              style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: "bottom center",
                opacity: s > 0.1 ? 1 : 0,
              }}
            >
              <motion.div
                animate={{
                  y: [0, -800],
                  opacity: [0, 0.9, 0],
                  scale: [0.5, 1.2, 0.3],
                }}
                transition={{
                  duration: dur,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeOut",
                }}
                className="rounded-full"
                style={{
                  width: size,
                  height: size,
                  background: beam.color,
                  boxShadow: `0 0 8px 3px ${beam.color}`,
                }}
              />
            </div>
          );
        })
      )}
    </div>
  );
}

const portalWordsData = "We transform |bold ideas| into |tangible art| and environments that |evoke emotion,| |engage the senses,| and |connect people| to |story, space,| and each other."
  .split(" ")
  .map((word) => {
    const isGold = word.startsWith("|") || word.endsWith("|");
    return { text: word.replace(/\|/g, ""), gold: isGold };
  });

function PortalText({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold leading-tight">
      {portalWordsData.map((word, i) => {
        // Spread the reveal across 0.55 → 0.88 of scroll
        const start = 0.55 + (i / portalWordsData.length) * 0.33;
        const end = start + 0.02;
        return (
          <motion.span
            key={i}
            style={{
              opacity: useTransform(scrollYProgress, [start, end], [0.12, 1]),
            }}
            className={`inline-block mr-[0.3em] ${word.gold ? "text-gradient" : ""}`}
          >
            {word.text}
          </motion.span>
        );
      })}
    </h2>
  );
}


function NestedTriangles({ spread }: { spread: number }) {
  const s = spread;
  if (s < 0.02) return null;

  const scale = 2.5 + s * 3;
  const bgOpacity = Math.min(1, s * 5);
  const triOpacity = Math.min(1, s * 2.5) * 0.7;

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none">
      <div className="absolute inset-0" style={{ background: "#050510", opacity: bgOpacity }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/branding/logo-hd.svg"
        alt=""
        className="absolute select-none"
        style={{
          width: "350vmax",
          height: "350vmax",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -42%) scale(${scale})`,
          opacity: triOpacity,
        }}
      />
    </div>
  );
}

// Pre-computed ember data to avoid Math.random() during SSR hydration
const forgeEmberColors = ["#ff6b35", "#ff4500", "#ffaa00", "#f43f5e", "#a855f7", "#22c55e", "#60b5ff"];
// Seeded-style deterministic values per ember (avoids server/client mismatch)
const forgeEmbers = Array.from({ length: 20 }, (_, i) => {
  // Use index-based pseudo-random instead of Math.random() to stay deterministic
  const s = (i * 7919 + 1) % 100 / 100; // pseudo-random 0-1 from index
  const s2 = (i * 6271 + 3) % 100 / 100;
  const s3 = (i * 4391 + 7) % 100 / 100;
  const s4 = (i * 5431 + 11) % 100 / 100;
  const s5 = (i * 3001 + 13) % 100 / 100;
  const s6 = (i * 8513 + 17) % 100 / 100;
  return {
    color: forgeEmberColors[i % forgeEmberColors.length],
    yEnd: -300 - s * 300,
    xStart: (s2 - 0.5) * 80,
    xEnd: (s3 - 0.5) * 400,
    duration: 2.5 + s4 * 2.5,
    delay: s5 * 4,
    left: `${15 + s6 * 70}%`,
    size: 4 + s * 4,
  };
});

const galleryItems = [
  { name: "The Portal", image: "/images/portfolio/the-portal.jpg", subtitle: "Stainless Steel · 2017", id: "the-portal" },
  { name: "Female Twin", image: "/images/portfolio/female-twin.jpg", subtitle: "Stainless Steel · 2009", id: "female-twin" },
  { name: "Echeveria", image: "/images/portfolio/echeveria.jpg", subtitle: "Steel, Bronze, Copper · 2015", id: "echeveria" },
  { name: "Le Attrata", image: "/images/portfolio/le-attrata.jpg", subtitle: "Mixed Media Installation", id: "le-attrata" },
  { name: "Divi", image: "/images/portfolio/divi.jpg", subtitle: "Mixed Media Sculpture", id: "divi" },
  { name: "Fata", image: "/images/portfolio/fata.jpg", subtitle: "Kinetic Fire Sculpture", id: "fata" },
  { name: "Gilly", image: "/images/portfolio/gilly.jpg", subtitle: "Mixed Media Sculpture", id: "gilly" },
  { name: "Springwater", image: "/images/portfolio/springwater.jpg", subtitle: "Mixed Media Installation", id: "springwater" },
];

export default function Home() {
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  // Scroll-linked transforms for the hero zoom effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Phase 1 (0-35%): Hero image visible, ring spinning
  const bgOpacity = useTransform(scrollYProgress, [0, 0.25, 0.4], [0.8, 0.6, 0]);

  // Portal ring — spins fast in phase 1, fades in phase 2
  const portalRotation = useTransform(scrollYProgress, [0, 0.4], [0, 720]);
  const portalGlow = useTransform(scrollYProgress, [0, 0.15, 0.3], [0.2, 0.6, 1]);
  const portalBorderWidth = useTransform(scrollYProgress, [0, 0.15, 0.3], [2, 4, 8]);
  const portalRingOpacity = useTransform(scrollYProgress, [0, 0.03, 0.32, 0.42], [0, 1, 1, 0]);

  // Phase 2 (25-45%): Triangle clip opens, hero text fades
  const clipSize = useTransform(scrollYProgress, [0.25, 0.38, 0.45], [0, 35, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.28, 0.38], [1, 1, 0]);

  // Triangle spread — triggers early in hero scroll (throttled to avoid excess re-renders)
  const [triangleSpread, setTriangleSpread] = useState(0);
  const triangleRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(1, Math.max(0, (v - 0.3) / 0.25));
    // Only re-render if value changed meaningfully (> 1% difference)
    if (Math.abs(next - triangleRef.current) > 0.01) {
      triangleRef.current = next;
      setTriangleSpread(next);
    }
  });

  // Laser section — standalone scroll-driven
  const laserSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: laserProgress } = useScroll({
    target: laserSectionRef,
    offset: ["start end", "end start"],
  });
  const [laserSpread, setLaserSpread] = useState(0);
  const laserRef = useRef(0);
  useMotionValueEvent(laserProgress, "change", (v) => {
    const next = Math.min(1, Math.max(0, (v - 0.1) / 0.6));
    if (Math.abs(next - laserRef.current) > 0.01) {
      laserRef.current = next;
      setLaserSpread(next);
    }
  });

  // Animated counter for stats
  useEffect(() => {
    if (!counterRef.current) return;

    const ctx = gsap.context(() => {
      const counters = counterRef.current!.querySelectorAll("[data-count]");
      counters.forEach((el) => {
        const target = parseInt(el.getAttribute("data-count") || "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            (el as HTMLElement).textContent = String(Math.round(obj.val));
          },
        });
      });
    }, counterRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ===== HERO — Scroll-zoom into 3D blob ===== */}
      <section ref={heroRef} className="relative h-[600vh]" style={{ zIndex: 0 }}>
        <div className="sticky top-0 h-screen overflow-hidden pointer-events-none">

          {/* Background image — bright and centered */}
          <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 z-0">
            <Image
              src="/images/hero/numinous-hero.png"
              alt="Numinous Designs hero — large-scale metal sculpture installation"
              fill
              className="object-cover"
              style={{ objectPosition: "center 40%" }}
              priority
            />
            <div className="absolute inset-0 bg-numinous-black/15" />
          </motion.div>

          {/* Portal Ring — positioned to match the sculpture's portal opening
              Adjust these values to align with the background image:
              top: 42% = vertical position (lower = move down)
              left: 47% = horizontal position (lower = move left)
              size: 400px = ring diameter */}
          {/* Portal ring — circular, aligned with sculpture */}
          <div className="absolute inset-0 z-[2] pointer-events-none" style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-start" }}>
            <motion.div
              style={{
                rotate: portalRotation,
                borderWidth: portalBorderWidth,
                opacity: portalRingOpacity,
                boxShadow: useTransform(
                  portalGlow,
                  (v) =>
                    `0 0 ${20 + v * 50}px rgba(100,180,255,${v * 0.5}), inset 0 0 ${15 + v * 35}px rgba(100,180,255,${v * 0.25}), 0 0 ${5 + v * 15}px rgba(150,200,255,${v * 0.3})`
                ),
                width: 520,
                height: 520,
                top: "calc(50% - 260px)",
                left: "calc(48% - 260px)",
              }}
              className="absolute rounded-full border-sky-400/60"
            >
              <svg viewBox="0 0 520 520" className="w-full h-full absolute inset-0">
                <defs>
                  <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60b5ff" stopOpacity="0.9" />
                    <stop offset="25%" stopColor="#3d8fdb" stopOpacity="0.15" />
                    <stop offset="50%" stopColor="#7ec8e3" stopOpacity="0.9" />
                    <stop offset="75%" stopColor="#3d8fdb" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#60b5ff" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <circle cx="260" cy="260" r="254" fill="none" stroke="url(#portalGrad)" strokeWidth="3" strokeDasharray="20 8 6 8" />
                <circle cx="260" cy="260" r="244" fill="none" stroke="url(#portalGrad)" strokeWidth="1.5" strokeDasharray="35 18" opacity="0.5" />
                <circle cx="260" cy="260" r="257" fill="none" stroke="#7ec8e3" strokeWidth="1" strokeDasharray="6 14" opacity="0.25" />
              </svg>
            </motion.div>
          </div>


          {/* Next section revealed INSIDE the portal */}
          <motion.div
            style={{
              clipPath: useTransform(clipSize, (s) => {
                const cx = 48, cy = 46;
                const halfW = s * 0.7;
                const h = s * 1.3;
                const topY = cy - h * 0.6;
                const botY = cy + h * 0.4;
                return `polygon(${cx}% ${topY}%, ${cx + halfW}% ${botY}%, ${cx - halfW}% ${botY}%)`;
              }),
            }}
            className="absolute inset-0 z-[3]"
          >
            <div className="w-full h-full bg-[#050510] flex items-center justify-center relative overflow-hidden">
              <NestedTriangles spread={triangleSpread} />
              <div className="relative z-10 text-center px-8 max-w-5xl">
                <div className="backdrop-blur-md bg-black/40 rounded-2xl px-10 py-12 border border-white/5">
                  <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-8">
                    NUMINOUS
                  </p>
                  <PortalText scrollYProgress={scrollYProgress} />
                  <div className="mt-10">
                    <p className="text-base text-white/40 max-w-xl mx-auto">
                      A creative fabrication & design studio headquartered in Santa Cruz, California,
                      with satellite locations in NYC, Las Vegas, Denver, and Portland.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero text — over everything */}
          <motion.div
            style={{ opacity: contentOpacity }}
            className="absolute inset-0 z-[4] flex items-center justify-center"
          >
            <div className="text-center px-6 max-w-5xl pointer-events-auto">
              <div className="h-px w-12 bg-numinous-ember mx-auto mb-8" />
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[6.5rem] font-heading font-bold leading-[0.9] tracking-tight mb-10 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
                We Create
                <br />
                <span className="text-gradient">Experiences</span>
                <br />
                That Move You
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-white/50 max-w-lg mx-auto mb-12 leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                An experience that makes you feel awed yet attracted, excited yet fascinated.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center">
                <MagneticButton
                  href="/portfolio"
                  className="px-10 py-4 bg-numinous-ember text-black font-medium text-xs tracking-[0.2em] uppercase hover:bg-numinous-fire transition-colors duration-300"
                >
                  View Our Work
                </MagneticButton>
                <MagneticButton
                  href="/about"
                  className="px-10 py-4 border border-white/20 text-white/80 text-xs tracking-[0.2em] uppercase hover:border-numinous-ember/40 hover:text-white transition-all duration-300 backdrop-blur-sm"
                >
                  Learn More
                </MagneticButton>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.06], [1, 0]) }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-3"
          >
            <p className="text-[9px] tracking-[0.4em] uppercase text-white/30">Scroll</p>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-4 h-7 border border-white/20 rounded-full flex justify-center pt-1.5"
            >
              <div className="w-0.5 h-1.5 bg-numinous-ember rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ===== TRIANGLE BACKGROUND — persists through brand/laser/stats ===== */}
      <div className="relative">
        <div className="absolute inset-0 z-0 bg-[#050510]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/branding/logo-hd.svg"
            alt=""
            className="sticky top-0 w-full h-screen object-contain select-none pointer-events-none"
            style={{ opacity: 0.5, filter: "brightness(1.5)" }}
          />
        </div>

      {/* ===== BRAND NAME + STATS with LASER BACKGROUND ===== */}
      <section ref={laserSectionRef} className="relative z-10 overflow-hidden">
        {/* Laser light show behind everything */}
        <div className="absolute inset-0 bg-[#050510]">
          <LaserShow spread={laserSpread} />
        </div>

        {/* Brand name */}
        <div className="relative z-10 pt-32 pb-8 px-6 text-center">
          <ScrollReveal>
            <p className="text-xs tracking-[0.5em] uppercase text-numinous-ember mb-6">
              Forged in Fire &amp; Vision
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-heading font-bold leading-[0.85] tracking-tight">
              <span className="text-gradient">NUMINOUS</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.25}>
            <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-[7rem] xl:text-[8rem] font-heading font-light leading-[0.9] tracking-[0.15em] text-white/80 mt-2">
              DESIGNS
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.35}>
            <p className="text-xs tracking-[0.5em] uppercase text-numinous-ember/80 mt-8">
              Creative Fabrication &amp; Design Studio
            </p>
          </ScrollReveal>
        </div>

        {/* Stats */}
        <div ref={counterRef} className="relative z-10 py-32 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { count: 5, label: "Studio Locations" },
              { count: 15, label: "Years of Craft", suffix: "+" },
              { count: 50, label: "Installations", suffix: "+" },
              { count: 8, label: "Core Artists" },
            ].map((stat) => (
              <ScrollReveal key={stat.label}>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gradient mb-2">
                    <span data-count={stat.count}>0</span>
                    {stat.suffix || ""}
                  </p>
                  <p className="text-xs tracking-[0.3em] uppercase text-white/30">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      </div>{/* close triangle background wrapper */}

      {/* ===== EVERYTHING BELOW: Flame background ===== */}
      <div className="relative">
        <FlameBackground />

      {/* ===== HORIZONTAL SCROLL GALLERY ===== */}
      <div className="relative z-10">
      <HorizontalGallery
        items={galleryItems}
        onItemClick={(i) => setSelectedPiece(i)}
      />

      {/* Sculpture popup card */}
      <AnimatePresence>
        {selectedPiece !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPiece(null)}
            className="fixed inset-0 z-50 bg-numinous-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                <Image
                  src={galleryItems[selectedPiece].image}
                  alt={galleryItems[selectedPiece].name}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] tracking-[0.3em] uppercase text-numinous-ember mb-3">
                  {galleryItems[selectedPiece].subtitle}
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-6">
                  {galleryItems[selectedPiece].name}
                </h2>
                <div className="flex gap-4">
                  <Link
                    href={`/portfolio?piece=${galleryItems[selectedPiece].id}`}
                    className="px-6 py-2 bg-numinous-ember text-black text-xs tracking-widest uppercase hover:bg-numinous-fire transition-colors"
                  >
                    Full Details
                  </Link>
                  <button
                    onClick={() => setSelectedPiece(null)}
                    className="px-6 py-2 border border-white/20 text-white/60 text-xs tracking-widest uppercase hover:border-numinous-ember hover:text-numinous-ember transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* ===== SKETCH TO STEEL SECTION ===== */}
      <section className="relative z-10 py-40 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              From{" "}
              <span
                className="italic"
                style={{
                  fontFamily: "var(--font-caveat), cursive",
                  fontWeight: 400,
                  opacity: 0.85,
                  letterSpacing: "0.02em",
                  fontSize: "1.15em",
                }}
              >
                sketch
              </span>{" "}
              to{" "}
              <span
                style={{
                  background: "linear-gradient(180deg, #c0c0c0 0%, #808080 40%, #e8e8e8 50%, #909090 60%, #a0a0a0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  textShadow: "none",
                  filter: "contrast(1.2)",
                }}
              >
                steel
              </span>
              ,{" "}
              <span
                style={{
                  background: "linear-gradient(180deg, #ff6b35 0%, #ff4500 30%, #ff8c00 50%, #ff0000 70%, #cc3300 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "brightness(1.3)",
                }}
              >
                fire
              </span>{" "}
              to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #ffd700 0%, #ff8c00 25%, #ffd700 50%, #fff4cc 75%, #ffd700 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "brightness(1.2) saturate(1.3)",
                }}
              >
                finish
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="text-sm md:text-base text-white/40 max-w-xl mx-auto mb-16">
              Every piece begins as a vision. We bring together world-class artists, engineers,
              and fabricators to forge the extraordinary.
            </p>
          </ScrollReveal>

          {/* Before → After showcase */}
          <div className="grid grid-cols-1 gap-16 mb-16">
            {/* Pair 1: Sketch → Fabricated sculpture */}
            <ScrollReveal delay={0.1}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex-1 aspect-[4/3] overflow-hidden rounded-lg border border-white/10 group">
                  <Image
                    src="/images/hero/sketch.png"
                    alt="Sculpture concept sketch"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-numinous-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-[10px] tracking-[0.3em] uppercase text-white/50">Concept Sketch</span>
                </div>

                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                  <svg className="w-10 h-10 text-numinous-ember md:rotate-0 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[9px] tracking-[0.3em] uppercase text-white/20">Forged</span>
                </div>

                <div className="relative flex-1 aspect-[4/3] overflow-hidden rounded-lg border border-white/10 group">
                  <Image
                    src="/images/hero/fabrication.jpg"
                    alt="Finished steel sculpture"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-numinous-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-[10px] tracking-[0.3em] uppercase text-white/50">Finished Sculpture</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Pair 2: Workshop fabrication → Finished Portal */}
            <ScrollReveal delay={0.2}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex-1 aspect-[4/3] overflow-hidden rounded-lg border border-white/10 group">
                  <Image
                    src="/images/about/workshop.jpeg"
                    alt="Workshop fabrication in progress"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-numinous-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-[10px] tracking-[0.3em] uppercase text-white/50">In the Workshop</span>
                </div>

                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                  <svg className="w-10 h-10 text-numinous-ember md:rotate-0 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[9px] tracking-[0.3em] uppercase text-white/20">Forged</span>
                </div>

                <div className="relative flex-1 aspect-[4/3] overflow-hidden rounded-lg border border-white/10 group">
                  <Image
                    src="/images/portfolio/the-portal.jpg"
                    alt="The Portal — finished installation"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-numinous-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-[10px] tracking-[0.3em] uppercase text-white/50">The Portal — Installed</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.4}>
            <MagneticButton
              href="/services"
              className="px-10 py-4 border border-numinous-ember/40 text-numinous-ember text-xs tracking-[0.2em] uppercase hover:bg-numinous-ember hover:text-black transition-all duration-500"
            >
              Our Services
            </MagneticButton>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FORGE DEFENDERS GAME HYPE ===== */}
      <section className="relative z-10 py-32 overflow-hidden">
        {/* Animated fire background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-numinous-black via-numinous-ember/8 to-numinous-black" />
          <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-numinous-ember to-transparent" />
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-numinous-ember/50 to-transparent" />
          {forgeEmbers.map((ember, i) => (
              <motion.div
                key={`forge-ember-${i}`}
                animate={{
                  y: [0, ember.yEnd],
                  x: [ember.xStart, ember.xEnd],
                  opacity: [0, 1, 0],
                  scale: [0.3, 1.2, 0],
                }}
                transition={{
                  duration: ember.duration,
                  repeat: Infinity,
                  delay: ember.delay,
                  ease: "easeOut",
                }}
                className="absolute rounded-full"
                style={{
                  bottom: "10%",
                  left: ember.left,
                  width: ember.size,
                  height: ember.size,
                  background: ember.color,
                  boxShadow: `0 0 12px 4px ${ember.color}80`,
                }}
              />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="text-xs tracking-[0.5em] uppercase text-numinous-ember mb-6 font-mono">
              Numinous Arcade
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-4">
              Defend the <span className="text-gradient">Forge</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-base md:text-lg lg:text-xl text-white/50 max-w-2xl mx-auto mb-12">
              Elemental creatures have risen from the forge. Fire serpents, crystal beasts,
              shadow wings, and the Portal itself — all standing between you and survival.
              Can you hold the line?
            </p>
          </ScrollReveal>

          {/* Enemy preview cards */}
          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 max-w-3xl mx-auto mb-14">
              {[
                { name: "Echeveria", element: "Earth", color: "#22c55e", emoji: "🌿", desc: "Crystal rosette" },
                { name: "Fata", element: "Fire", color: "#ff6b35", emoji: "🔥", desc: "Flame spinner" },
                { name: "Gilly", element: "Shadow", color: "#a855f7", emoji: "🦇", desc: "Shadow wings" },
                { name: "Divi", element: "Arcane", color: "#f43f5e", emoji: "💎", desc: "Arcane diamond" },
                { name: "Portal", element: "Void", color: "#60b5ff", emoji: "🌀", desc: "BOSS" },
              ].map((enemy, i) => (
                <motion.div
                  key={enemy.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  viewport={{ once: true }}
                  className="relative p-4 border border-white/10 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 group"
                >
                  <div
                    className="w-10 h-10 mx-auto mb-2 rounded border flex items-center justify-center text-lg font-mono"
                    style={{
                      borderColor: `${enemy.color}40`,
                      boxShadow: `0 0 12px ${enemy.color}20`,
                      background: `${enemy.color}10`,
                    }}
                  >
                    <span style={{ filter: "saturate(1.5)" }}>{enemy.emoji}</span>
                  </div>
                  <p className="text-xs font-mono font-bold" style={{ color: enemy.color }}>
                    {enemy.name}
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5">{enemy.desc}</p>
                  <p
                    className="text-[9px] tracking-wider uppercase mt-1"
                    style={{ color: `${enemy.color}80` }}
                  >
                    {enemy.element}
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <MagneticButton
              href="/game"
              className="px-8 py-4 md:px-14 md:py-5 bg-numinous-ember text-black font-bold text-xs md:text-sm tracking-[0.25em] uppercase hover:bg-numinous-fire transition-colors duration-300 glow-ember"
            >
              Fight Now
            </MagneticButton>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== DRONE FOOTAGE ===== */}
      <section className="relative z-10 py-20">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-4 text-center">
              Take a Look at Our Homebase
            </p>
            <VideoPlayer
              src="/videos/drone-aerial.mp4"
              className="aspect-video"
            />
          </div>
        </ScrollReveal>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative z-10 py-48 px-6">

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <TextReveal
            as="h2"
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-bold mb-8"
          >
            Have a bold idea?
          </TextReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-sm md:text-base text-white/40 mb-14 max-w-lg mx-auto">
              Let&apos;s make it real. Reach out and our team of experienced artists, designers,
              and fabricators will connect with you.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <MagneticButton
              href="/faq#contact"
              strength={0.4}
              className="inline-block px-8 py-4 md:px-14 md:py-5 bg-numinous-ember text-black font-medium text-xs tracking-[0.2em] uppercase hover:bg-numinous-fire transition-colors duration-300 glow-ember"
            >
              Start a Conversation
            </MagneticButton>
          </ScrollReveal>
        </div>
      </section>

      </div>{/* close flame background wrapper */}
    </>
  );
}
