"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Pre-compute ember data once so React doesn't recalculate on every render
const EMBER_COUNT = 25;
const EMBER_COLORS = ["#ff6b35", "#e8d44d", "#a855f7", "#60b5ff", "#22c55e", "#f43f5e", "#7ec8e3"];

function useEmberData() {
  const [embers, setEmbers] = useState<Array<{
    dx: number; dy: number; color: string; duration: number;
    delay: number; size: number; top: string; left: string;
  }>>([]);

  useEffect(() => {
    setEmbers(Array.from({ length: EMBER_COUNT }, (_, i) => {
      const angle = (i / EMBER_COUNT) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 300 + Math.random() * 500;
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        color: EMBER_COLORS[i % EMBER_COLORS.length],
        duration: 2.5 + Math.random() * 3,
        delay: Math.random() * 5,
        size: 2 + Math.random() * 3,
        top: `${30 + Math.random() * 40}%`,
        left: `${30 + Math.random() * 40}%`,
      };
    }));
  }, []);

  return embers;
}

export default function FlameBackground() {
  const [visible, setVisible] = useState(false);
  const embers = useEmberData();

  useEffect(() => {
    let ticking = false;
    const heroEnd = window.innerHeight * 5;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > heroEnd);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ willChange: "transform" }}>
      {/* Base layer — slow drift left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35, x: [0, -200, 0], y: [0, -30, 0] }}
        transition={{
          opacity: { duration: 2 },
          x: { duration: 30, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 30, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/hero/flames.png)",
          backgroundSize: "120% auto",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          willChange: "transform, opacity",
        }}
      />

      {/* Second layer — mirrored, drifts right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2, x: [0, 150, 0], y: [0, 20, 0] }}
        transition={{
          opacity: { duration: 2 },
          x: { duration: 25, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 25, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/hero/flames.png)",
          backgroundSize: "140% auto",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          transform: "scaleX(-1)",
          filter: "hue-rotate(30deg)",
          willChange: "transform, opacity",
        }}
      />

      {/* Third layer — slow vertical pulse with color shift */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15, y: [0, -50, 0], scale: [1, 1.05, 1] }}
        transition={{
          opacity: { duration: 2 },
          y: { duration: 20, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 20, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/hero/flames.png)",
          backgroundSize: "130% auto",
          backgroundPosition: "center 40%",
          backgroundRepeat: "no-repeat",
          filter: "hue-rotate(-40deg) saturate(1.5)",
          willChange: "transform, opacity",
        }}
      />

      {/* Ember particles */}
      {embers.map((ember, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, ember.dx],
            y: [0, ember.dy],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: ember.duration,
            repeat: Infinity,
            delay: ember.delay,
            ease: "easeOut",
          }}
          className="absolute rounded-full"
          style={{
            top: ember.top,
            left: ember.left,
            width: ember.size,
            height: ember.size,
            background: ember.color,
            boxShadow: `0 0 6px 2px ${ember.color}80`,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Vignette for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-numinous-black/60 via-transparent to-numinous-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-numinous-black/30 via-transparent to-numinous-black/30" />
    </div>
  );
}
