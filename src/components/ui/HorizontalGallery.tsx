"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GalleryItem {
  name: string;
  image: string;
  subtitle?: string;
}

interface HorizontalGalleryProps {
  items: GalleryItem[];
  onItemClick?: (index: number) => void;
}

export default function HorizontalGallery({ items, onItemClick }: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const scrollWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          pin: true,
          pinType: "transform",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-20 h-px bg-white/5">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-numinous-ember to-numinous-gold transition-none"
          style={{ width: 0 }}
        />
      </div>

      {/* Label */}
      <div className="absolute top-8 left-8 z-20">
        <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember">
          Selected Work
        </p>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-2">
        <div className="w-8 h-px bg-white/20" />
        <p className="text-[10px] tracking-widest uppercase text-white/20">
          Scroll
        </p>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex items-center h-full gap-8 px-[10vw] will-change-transform"
        style={{ width: `${items.length * 45 + 20}vw` }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="gallery-card relative flex-shrink-0 w-[40vw] h-[70vh] cursor-pointer group"
            onClick={() => onItemClick?.(i)}
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 border border-white/0 group-hover:border-numinous-ember/30 transition-colors duration-500 rounded-lg" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-[10px] tracking-[0.3em] uppercase text-numinous-ember mb-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {item.subtitle}
                </p>
                <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3">
                  {item.name}
                </h3>
                <p className="text-xs tracking-widest uppercase text-white/0 group-hover:text-numinous-ember/70 transition-all duration-500">
                  View Piece &rarr;
                </p>
              </div>

              <div className="absolute top-6 right-6 text-6xl font-heading font-bold text-white/5 group-hover:text-white/10 transition-colors duration-500">
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
