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
    color: "#a1a1aa",
    capability: "TIG/MIG welding, mirror polishing, brushed & bead-blast finishes. Up to 3\" plate, full structural certification.",
    uses: "Primary structure, skin panels, load-bearing frames",
  },
  {
    name: "Aluminum",
    color: "#93c5fd",
    capability: "CNC machining, casting, anodizing, powder coating. Lightweight structural assemblies and precision components.",
    uses: "Internal armatures, lightweight cladding, mechanical joints",
  },
  {
    name: "Copper",
    color: "#f97316",
    capability: "Hand-forming, patina development, brazing, electroforming. Living finishes that evolve over time.",
    uses: "Decorative surfaces, water features, patina accents",
  },
  {
    name: "Bronze",
    color: "#ca8a04",
    capability: "Lost-wax casting, sand casting, chasing & finishing. Traditional and digital sculpting workflows.",
    uses: "Cast sculptural elements, plaques, fine detail work",
  },
  {
    name: "Glass",
    color: "#60b5ff",
    capability: "Kiln-formed, blown, laminated, LED-integrated. Tempered and structural glass engineering.",
    uses: "Illuminated panels, lenses, transparent structural elements",
  },
  {
    name: "Resin & Composites",
    color: "#a855f7",
    capability: "Fiberglass layup, carbon fiber, epoxy casting, 3D-printed molds. Complex organic forms.",
    uses: "Organic shells, lightweight forms, translucent elements",
  },
  {
    name: "Wood",
    color: "#b45309",
    capability: "CNC routing, steam bending, traditional joinery, charred (shou sugi ban) finishes.",
    uses: "Warm accent elements, bases, interior installations",
  },
  {
    name: "Integrated Lighting",
    color: "#fbbf24",
    capability: "Addressable LED, fiber optic, DMX control, reactive systems. Fire-rated and outdoor-rated assemblies.",
    uses: "Internal illumination, interactive effects, programmable displays",
  },
  {
    name: "Fire Systems",
    color: "#ef4444",
    capability: "Propane & natural gas, flame effects, kinetic fire sculpture. Safety-certified for public installation.",
    uses: "Kinetic flame elements, fire features, pyrotechnic effects",
  },
];

const process = [
  {
    step: "01",
    title: "Concept & Design",
    description:
      "We start with your vision — sketches, 3D models, and technical drawings that map material, form, and engineering before a single cut is made.",
  },
  {
    step: "02",
    title: "Engineering & Fabrication",
    description:
      "Steel, aluminum, copper, and glass shaped in-house with TIG/MIG welding, CNC machining, and hand-forming to exacting structural tolerances.",
  },
  {
    step: "03",
    title: "Finishing & Integration",
    description:
      "Mirror polish, patina, and powder coat — then integrated lighting, water, and fire systems brought together into one living piece.",
  },
  {
    step: "04",
    title: "Installation & Production",
    description:
      "Rigging, transport, and on-site assembly for galleries, festivals, and permanent installations — engineered to be safe and built to last.",
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
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${mat.color}12`, border: `1px solid ${mat.color}30` }}
                  >
                    <span
                      className="w-4 h-4 rounded-[3px]"
                      style={{ background: mat.color, boxShadow: `0 0 8px ${mat.color}55` }}
                    />
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

        {/* Our Process */}
        <ScrollReveal>
          <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-4">
            How We Work
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            From Spark to Installation
          </h2>
          <p className="text-base text-white/40 max-w-2xl mb-16">
            Every commission moves through the same four stages — vision, build,
            finish, and install — handled end to end, in-house.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-lg overflow-hidden border border-white/5">
          {process.map((phase, i) => (
            <ScrollReveal key={phase.step} delay={i * 0.08}>
              <div className="group relative h-full bg-numinous-black p-8 hover:bg-white/[0.02] transition-colors duration-500">
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-heading text-5xl font-bold text-white/10 group-hover:text-numinous-ember/40 transition-colors duration-500">
                    {phase.step}
                  </span>
                  <span className="h-px flex-1 bg-white/10 group-hover:bg-numinous-ember/30 transition-colors duration-500" />
                </div>
                <h3 className="text-lg font-heading font-bold mb-3">{phase.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  {phase.description}
                </p>
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
