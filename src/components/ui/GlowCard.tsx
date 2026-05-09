"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlowCard({ children, className = "" }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-lg glass glass-hover ${className}`}
      style={{
        background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,107,53,0.06), transparent 60%)`,
      }}
    >
      <div className="absolute inset-0 rounded-lg border border-white/5 hover:border-numinous-ember/20 transition-colors duration-500 pointer-events-none" />
      {children}
    </motion.div>
  );
}
