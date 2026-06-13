"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const locations = [
  "Santa Cruz, CA (HQ)",
  "New York, NY",
  "Las Vegas, NV",
];

export default function Footer() {
  return (
    <footer role="contentinfo" className="relative border-t border-white/5">
      {/* Gradient glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-numinous-ember/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Image
              src="/images/branding/logo.png"
              alt="Numinous Designs"
              width={160}
              height={36}
              className="h-9 w-auto brightness-110 mb-6"
            />
            <p className="text-sm text-white/40 leading-relaxed">
              Forging art, structure, and story into experience.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-white/30 mb-4">
              Navigate
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { href: "/portfolio", label: "Portfolio" },
                { href: "/services", label: "Services" },
                { href: "/about", label: "About" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/50 hover:text-numinous-ember transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-white/30 mb-4">
              Services
            </h4>
            <div className="flex flex-col gap-3">
              {["Design", "Fabrication", "Consulting", "Event Production"].map(
                (s) => (
                  <span key={s} className="text-sm text-white/50">
                    {s}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-white/30 mb-4">
              Locations
            </h4>
            <div className="flex flex-col gap-3">
              {locations.map((loc) => (
                <span key={loc} className="text-sm text-white/50">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Numinous Designs. All rights
            reserved.
          </p>
          <motion.a
            href="https://www.linkedin.com/company/numinous-designs-llc/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Numinous Designs on LinkedIn (opens in new tab)"
            whileHover={{ scale: 1.1 }}
            className="text-xs text-white/30 hover:text-numinous-ember transition-colors"
          >
            LinkedIn &rarr;
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
