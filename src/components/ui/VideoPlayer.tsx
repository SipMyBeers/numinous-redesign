"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoPlayer({
  src,
  label,
  className = "",
}: {
  src: string;
  label?: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const expandedVideoRef = useRef<HTMLVideoElement>(null);

  const handleExpand = () => {
    setExpanded(true);
    // Sync time
    if (videoRef.current && expandedVideoRef.current) {
      expandedVideoRef.current.currentTime = videoRef.current.currentTime;
    }
  };

  return (
    <>
      {/* Inline video */}
      <div
        onClick={handleExpand}
        className={`relative overflow-hidden rounded-lg border border-white/10 cursor-pointer group transition-all duration-500 hover:border-numinous-ember/50 ${className}`}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>

        {/* Hover glow overlay */}
        <div className="absolute inset-0 bg-numinous-ember/0 group-hover:bg-numinous-ember/5 transition-all duration-500 pointer-events-none" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: "inset 0 0 40px rgba(255,107,53,0.15)" }}
        />

        {/* Bottom gradient + label */}
        <div className="absolute inset-0 bg-gradient-to-t from-numinous-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Play/expand icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-numinous-black/60 border border-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white/80">
              <path d="M3.5 3.5L10 3.5L10 5.5L5.5 5.5L5.5 10L3.5 10L3.5 3.5Z" fill="currentColor" />
              <path d="M20.5 3.5L14 3.5L14 5.5L18.5 5.5L18.5 10L20.5 10L20.5 3.5Z" fill="currentColor" />
              <path d="M3.5 20.5L10 20.5L10 18.5L5.5 18.5L5.5 14L3.5 14L3.5 20.5Z" fill="currentColor" />
              <path d="M20.5 20.5L14 20.5L14 18.5L18.5 18.5L18.5 14L20.5 14L20.5 20.5Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        {label && (
          <div className="absolute bottom-4 left-5">
            <p className="text-xs tracking-[0.3em] uppercase text-numinous-ember">
              {label}
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(false)}
            className="fixed inset-0 z-50 bg-numinous-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[90vw] max-h-[85vh] aspect-video overflow-hidden rounded-lg border border-white/10"
            >
              <video
                ref={expandedVideoRef}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-contain bg-black"
              >
                <source src={src} type="video/mp4" />
              </video>

              {/* Close button */}
              <button
                onClick={() => setExpanded(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-numinous-black/60 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:border-numinous-ember transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
