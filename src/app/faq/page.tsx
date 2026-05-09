"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactForm from "@/components/ui/ContactForm";

import dynamic from "next/dynamic";
const BlueprintBackground = dynamic(() => import("@/components/ui/BlueprintBackground"), { ssr: false });

const faqs = [
  {
    q: "I have an idea. What do I do?",
    a: "Reach out to us! Our team of experienced artists, designers, and fabricators will connect with you to explore your concept and assess next steps — whether your vision is fully formed or just beginning to take shape.",
  },
  {
    q: "Will you do design work only?",
    a: "Absolutely. We provide standalone design services including concept sketches, 3D models, and technical drawings, even if you plan to fabricate elsewhere.",
  },
  {
    q: "Can you fabricate my existing design?",
    a: "Yes. Our team reviews designs for feasibility and collaborates on precision fabrication, adapting designs as needed during production to ensure the best possible outcome.",
  },
  {
    q: "Do you offer consulting services?",
    a: "Yes, covering materials, structural design, installation planning, and technical problem-solving at any stage of your project.",
  },
  {
    q: "Can you create and manage event production?",
    a: "Yes. We handle full event production encompassing installation, logistics, and creative staging for exhibitions, events, and activations.",
  },
  {
    q: "Can I visit the studio or fabrication shop?",
    a: "Yes! We welcome visitors by appointment. Reach out through our contact form to schedule a visit.",
  },
  {
    q: "What materials do you work with?",
    a: "We work with stainless steel, aluminum, copper, bronze, wood, glass, resin, fabric, and integrated lighting systems — plus experimental materials upon request.",
  },
  {
    q: "Is your work displayed anywhere outside the studio?",
    a: "Yes. Select installations appear at Area15 in Las Vegas and other public art spaces. We have both permanent and touring works in development.",
  },
];

function FAQItem({ item, index }: { item: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <ScrollReveal delay={index * 0.05}>
      <div className="border-b border-white/5">
        <button
          onClick={() => setOpen(!open)}
          className="w-full py-6 flex items-center justify-between text-left group"
        >
          <h3 className="text-lg font-heading font-medium group-hover:text-numinous-ember transition-colors duration-300 pr-8">
            {item.q}
          </h3>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl text-numinous-ember shrink-0"
          >
            +
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <p className="pb-6 text-white/50 leading-relaxed max-w-3xl">
                {item.a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollReveal>
  );
}

export default function FAQPage() {
  return (
    <>
    <BlueprintBackground />
    <div className="relative z-10 pt-32 pb-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <ScrollReveal>
          <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-4">
            Common Questions
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
            FAQ
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="text-lg text-white/50 max-w-2xl">
            Everything you need to know about working with Numinous Designs.
          </p>
        </ScrollReveal>
      </section>


      {/* FAQ List */}
      <section className="max-w-3xl mx-auto px-6 mb-32">
        {faqs.map((item, i) => (
          <FAQItem key={i} item={item} index={i} />
        ))}
      </section>

      {/* Contact CTA */}
      <section id="contact" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-numinous-black via-numinous-dark to-numinous-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-numinous-ember/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-6">
              Let&apos;s Talk
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Start a <span className="text-gradient">conversation</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-lg text-white/50 mb-12 max-w-2xl mx-auto">
              Whether you have a fully formed concept or the spark of an idea,
              reach out and let&apos;s explore what&apos;s possible together.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="glass rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
    </>
  );
}
