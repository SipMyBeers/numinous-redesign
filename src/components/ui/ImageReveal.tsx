"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
}

export default function ImageReveal({
  src,
  alt,
  className = "",
  direction = "left",
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !imageRef.current || !overlayRef.current) return;

    const dirMap = {
      left: { x: "-101%", y: "0%" },
      right: { x: "101%", y: "0%" },
      up: { x: "0%", y: "-101%" },
      down: { x: "0%", y: "101%" },
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.fromTo(
        overlayRef.current,
        { x: "0%", y: "0%" },
        { ...dirMap[direction], duration: 1, ease: "power4.inOut" }
      );

      tl.fromTo(
        imageRef.current,
        { scale: 1.3 },
        { scale: 1, duration: 1.5, ease: "power3.out" },
        "-=0.8"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [direction]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={imageRef} className="w-full h-full">
        <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" />
      </div>
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-numinous-black z-10"
      />
    </div>
  );
}
