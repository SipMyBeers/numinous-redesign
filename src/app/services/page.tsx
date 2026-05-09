"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GlowCard from "@/components/ui/GlowCard";
import ParallaxImage from "@/components/ui/ParallaxImage";
import VideoPlayer from "@/components/ui/VideoPlayer";

const AnimatedForge = dynamic(() => import("@/components/ui/AnimatedForge"), { ssr: false });

const services = [
  {
    title: "Design",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-10 h-10">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    description:
      "From initial concept sketches to detailed 3D models and technical drawings. We craft visions that push the boundaries of material and form.",
    details: [
      "Concept Development & Sketching",
      "3D Modeling & Rendering",
      "Technical Drawings & Blueprints",
      "Material & Finish Selection",
      "Scale Models & Prototyping",
    ],
    image: "/images/hero/sketch.png",
  },
  {
    title: "Fabrication",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-10 h-10">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    description:
      "World-class fabrication in stainless steel, aluminum, copper, wood, glass, resin, and beyond. Precision engineering meets artistic excellence.",
    details: [
      "Stainless Steel & Metal Fabrication",
      "CNC & Precision Machining",
      "Welding & Assembly",
      "Surface Treatment & Finishing",
      "Structural Engineering",
    ],
    image: "/images/hero/fabrication.jpg",
  },
  {
    title: "Consulting",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-10 h-10">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    description:
      "Expert guidance on materials, structural design, installation planning, and technical problem-solving at any stage of your project.",
    details: [
      "Material Science Advisory",
      "Structural & Safety Analysis",
      "Installation Planning & Logistics",
      "Budget & Timeline Consulting",
      "Technical Problem-Solving",
    ],
    image: "/images/about/workshop.jpeg",
  },
  {
    title: "Event Production",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-10 h-10">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    description:
      "Full-service event production encompassing installation, logistics, and creative staging for exhibitions, activations, and beyond.",
    details: [
      "Installation & Rigging",
      "Creative Staging & Lighting",
      "Logistics & Transport",
      "On-Site Project Management",
      "Temporary & Permanent Installations",
    ],
    image: "/images/about/workshop.jpeg",
  },
];

const materials = [
  {
    name: "Stainless Steel",
    icon: "⚙️",
    color: "#a1a1aa",
    capability: "TIG/MIG welding, mirror polishing, brushed & bead-blast finishes. Up to 3\" plate, full structural certification.",
    uses: "Primary structure, skin panels, load-bearing frames",
  },
  {
    name: "Aluminum",
    icon: "🪶",
    color: "#93c5fd",
    capability: "CNC machining, casting, anodizing, powder coating. Lightweight structural assemblies and precision components.",
    uses: "Internal armatures, lightweight cladding, mechanical joints",
  },
  {
    name: "Copper",
    icon: "🔶",
    color: "#f97316",
    capability: "Hand-forming, patina development, brazing, electroforming. Living finishes that evolve over time.",
    uses: "Decorative surfaces, water features, patina accents",
  },
  {
    name: "Bronze",
    icon: "🏺",
    color: "#ca8a04",
    capability: "Lost-wax casting, sand casting, chasing & finishing. Traditional and digital sculpting workflows.",
    uses: "Cast sculptural elements, plaques, fine detail work",
  },
  {
    name: "Glass",
    icon: "💎",
    color: "#60b5ff",
    capability: "Kiln-formed, blown, laminated, LED-integrated. Tempered and structural glass engineering.",
    uses: "Illuminated panels, lenses, transparent structural elements",
  },
  {
    name: "Resin & Composites",
    icon: "🧪",
    color: "#a855f7",
    capability: "Fiberglass layup, carbon fiber, epoxy casting, 3D-printed molds. Complex organic forms.",
    uses: "Organic shells, lightweight forms, translucent elements",
  },
  {
    name: "Wood",
    icon: "🪵",
    color: "#92400e",
    capability: "CNC routing, steam bending, traditional joinery, charred (shou sugi ban) finishes.",
    uses: "Warm accent elements, bases, interior installations",
  },
  {
    name: "Integrated Lighting",
    icon: "💡",
    color: "#fbbf24",
    capability: "Addressable LED, fiber optic, DMX control, reactive systems. Fire-rated and outdoor-rated assemblies.",
    uses: "Internal illumination, interactive effects, programmable displays",
  },
  {
    name: "Fire Systems",
    icon: "🔥",
    color: "#ef4444",
    capability: "Propane & natural gas, flame effects, kinetic fire sculpture. Safety-certified for public installation.",
    uses: "Kinetic flame elements, fire features, pyrotechnic effects",
  },
];

// Sculpture dissection data — materials breakdown like a tech teardown
const sculptureBreakdowns = [
  {
    name: "Echeveria",
    image: "/images/portfolio/echeveria.jpg",
    year: "2015",
    parts: [
      { label: "Outer Petals", material: "Stainless Steel", detail: "Mirror-polished 16ga 304SS, TIG welded", color: "#a1a1aa", x: 18, y: 22 },
      { label: "Inner Core", material: "Copper", detail: "Hand-formed & brazed, natural patina finish", color: "#f97316", x: 50, y: 35 },
      { label: "Stem Structure", material: "Bronze", detail: "Sand-cast structural spine, powder-coated", color: "#ca8a04", x: 55, y: 70 },
      { label: "Water Channels", material: "Glass", detail: "Kiln-formed borosilicate, integrated into petals", color: "#60b5ff", x: 75, y: 45 },
      { label: "LED Array", material: "Integrated Lighting", detail: "Addressable RGB, DMX-controlled wash", color: "#fbbf24", x: 35, y: 55 },
      { label: "Base Plate", material: "Stainless Steel", detail: "1\" 316SS plate, bolted foundation mount", color: "#a1a1aa", x: 50, y: 88 },
    ],
  },
  {
    name: "The Portal",
    image: "/images/portfolio/the-portal.jpg",
    year: "2017",
    parts: [
      { label: "Arch Frame", material: "Stainless Steel", detail: "Rolled 3\" tube, 304SS, structural welded", color: "#a1a1aa", x: 50, y: 15 },
      { label: "Skin Panels", material: "Aluminum", detail: "CNC-cut 5052 aluminum, powder-coated", color: "#93c5fd", x: 22, y: 35 },
      { label: "Fire Ring", material: "Fire Systems", detail: "Propane-fed, 24 burner ring, wind-rated", color: "#ef4444", x: 50, y: 45 },
      { label: "Glass Lens", material: "Glass", detail: "Tempered dichroic glass, color-shifting", color: "#60b5ff", x: 78, y: 30 },
      { label: "Internal Lighting", material: "Integrated Lighting", detail: "Fiber optic + LED strip, programmable", color: "#fbbf24", x: 35, y: 60 },
      { label: "Foundation", material: "Stainless Steel", detail: "Concrete-anchored 316SS base ring", color: "#a1a1aa", x: 50, y: 85 },
    ],
  },
];

export default function ServicesPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowX = useTransform(scrollYProgress, [0, 1], ["-20%", "120%"]);

  return (
    <>
    <AnimatedForge />

    <div className="relative z-10 pt-32 pb-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <ScrollReveal>
          <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-4">
            What We Do
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
            Services
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="text-lg text-white/50 max-w-2xl">
            Whether you have a fully formed vision or just the spark of an idea,
            we have the expertise to bring it to life.
          </p>
        </ScrollReveal>
      </section>

      {/* Design Process Video */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <ScrollReveal>
          <VideoPlayer
            src="/videos/drone-footage.mp4"
            label="Let's Design Something Extraordinary"
            className="aspect-video"
          />
        </ScrollReveal>
      </section>

      {/* Services */}
      <section ref={sectionRef} className="relative">
        {/* Animated glow */}
        <motion.div
          style={{ left: glowX }}
          className="absolute top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-numinous-ember/5 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              <ScrollReveal
                direction={i % 2 === 0 ? "left" : "right"}
                className={i % 2 === 1 ? "lg:order-2" : ""}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-numinous-black/60 to-transparent" />
                </div>
              </ScrollReveal>

              <ScrollReveal
                direction={i % 2 === 0 ? "right" : "left"}
                delay={0.2}
                className={i % 2 === 1 ? "lg:order-1" : ""}
              >
                <div className="text-numinous-ember mb-4">{service.icon}</div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  {service.title}
                </h2>
                <p className="text-white/50 leading-relaxed mb-8">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-center gap-3 text-sm text-white/60"
                    >
                      <span className="w-1.5 h-1.5 bg-numinous-ember rounded-full shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>


      {/* Materials */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <ScrollReveal>
          <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-4">
            What We Work With
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Materials &amp; Capabilities
          </h2>
          <p className="text-base text-white/40 max-w-2xl mb-16">
            Every sculpture is engineered from multiple materials, each chosen for its
            structural, aesthetic, and environmental properties. Here&apos;s what we work with.
          </p>
        </ScrollReveal>

        {/* Material cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-32">
          {materials.map((mat, i) => (
            <ScrollReveal key={mat.name} delay={i * 0.04}>
              <GlowCard className="p-6 group hover:border-white/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ background: `${mat.color}15`, border: `1px solid ${mat.color}30` }}
                  >
                    {mat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-heading font-bold mb-1" style={{ color: mat.color }}>
                      {mat.name}
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed mb-2">
                      {mat.capability}
                    </p>
                    <p className="text-[10px] tracking-wider uppercase text-white/25">
                      {mat.uses}
                    </p>
                  </div>
                </div>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Sculpture dissection diagrams */}
        <ScrollReveal>
          <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-4">
            Material Anatomy
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Inside the Sculptures
          </h2>
          <p className="text-base text-white/40 max-w-2xl mb-16">
            Like a high-fidelity product teardown, each sculpture is an assembly of
            precision-engineered components. Hover over the markers to explore.
          </p>
        </ScrollReveal>

        <div className="space-y-24">
          {sculptureBreakdowns.map((sculpture, si) => (
            <ScrollReveal key={sculpture.name} delay={0.1}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                {/* Image with annotation markers */}
                <div className={`relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-numinous-charcoal ${si % 2 === 1 ? "lg:order-2" : ""}`}>
                  <Image
                    src={sculpture.image}
                    alt={sculpture.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-numinous-black/30" />

                  {/* Annotation markers */}
                  {sculpture.parts.map((part, pi) => (
                    <div
                      key={pi}
                      className="absolute group/pin"
                      style={{ left: `${part.x}%`, top: `${part.y}%`, transform: "translate(-50%, -50%)" }}
                    >
                      {/* Pulse ring */}
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, delay: pi * 0.3 }}
                        className="absolute inset-0 rounded-full"
                        style={{ background: part.color, width: 12, height: 12, margin: "auto", left: 0, right: 0, top: 0, bottom: 0 }}
                      />
                      {/* Dot */}
                      <div
                        className="relative w-3 h-3 rounded-full border-2 border-white/80 cursor-pointer z-10 transition-transform duration-200 group-hover/pin:scale-150"
                        style={{ background: part.color, boxShadow: `0 0 8px ${part.color}80` }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/pin:opacity-100 transition-all duration-300 pointer-events-none z-20 w-48">
                        <div className="bg-numinous-black/90 border border-white/10 rounded-lg p-3 backdrop-blur-md">
                          <p className="text-[10px] tracking-wider uppercase mb-1" style={{ color: part.color }}>
                            {part.material}
                          </p>
                          <p className="text-xs font-bold text-white mb-1">{part.label}</p>
                          <p className="text-[10px] text-white/40 leading-relaxed">{part.detail}</p>
                        </div>
                        {/* Arrow */}
                        <div className="w-2 h-2 bg-numinous-black/90 border-r border-b border-white/10 rotate-45 mx-auto -mt-1" />
                      </div>
                    </div>
                  ))}

                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-5">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-numinous-ember">{sculpture.year}</p>
                    <p className="text-lg font-heading font-bold">{sculpture.name}</p>
                  </div>
                </div>

                {/* Parts list */}
                <div className={si % 2 === 1 ? "lg:order-1" : ""}>
                  <h3 className="text-2xl font-heading font-bold mb-2">{sculpture.name}</h3>
                  <p className="text-xs text-white/30 mb-6">Material breakdown · {sculpture.parts.length} components</p>

                  <div className="space-y-3">
                    {sculpture.parts.map((part, pi) => (
                      <div
                        key={pi}
                        className="flex items-start gap-3 p-3 rounded-lg border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
                      >
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ background: part.color, boxShadow: `0 0 6px ${part.color}60` }}
                        />
                        <div>
                          <p className="text-xs font-bold text-white/80">{part.label}</p>
                          <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: part.color }}>
                            {part.material}
                          </p>
                          <p className="text-[11px] text-white/35 leading-relaxed">{part.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 text-center py-20">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ready to <span className="text-gradient">build something</span>?
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-lg text-white/50 mb-10">
            Whether it&apos;s a sketch on a napkin or a detailed blueprint, we&apos;re
            here to make it happen.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <Link
            href="/faq#contact"
            className="inline-block px-10 py-4 bg-numinous-ember text-black font-medium text-sm tracking-widest uppercase hover:bg-numinous-fire transition-colors duration-300 glow-ember"
          >
            Get In Touch
          </Link>
        </ScrollReveal>
      </section>
    </div>
    </>
  );
}
