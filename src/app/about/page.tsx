"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GlowCard from "@/components/ui/GlowCard";

import dynamic from "next/dynamic";
const AnimatedBackground = dynamic(() => import("@/components/ui/AnimatedBackground"), { ssr: false });

const team = [
  {
    name: "J. Elliott",
    role: "Co-Founder / CEO",
    image: "/images/team/elliott.jpg",
    bio: "BS/MS Material Science, MBA from Haas School of Business. Data center and AI engineer turned creative technologist and former fire performer.",
  },
  {
    name: "Orion Fredericks",
    role: "Co-Founder",
    image: "/images/team/orion.png",
    bio: "Studied at University of Alfred and Pilchuck Glass School. Industrial artist specializing in fire sculpture and monumental fountains.",
  },
  {
    name: "Lucy Hosking",
    role: "Mechanical Artist & Fire Engineer",
    image: "/images/team/lucy.jpg",
    bio: "Created Dragons of Eden and Satan's Calliope for Burning Man. Mechanical engineer and fire sculptor in equal measure.",
  },
  {
    name: "Jason Gronlund",
    role: "Fine Artist & Technical Designer",
    image: "/images/team/jason-gronlund.jpg",
    bio: "20+ years of large-scale fabrication. Creator of Temple of Masks. Fine artist and master builder.",
  },
  {
    name: "Dallas Swindle",
    role: "Portland Lead",
    location: "Portland, OR",
    image: "/images/team/dallas-swindle.png",
    bio: "Master builder and technical designer with 20+ years collaborating on large-scale installations.",
  },
  {
    name: "Corey Silverman",
    role: "Denver Lead",
    location: "Denver, CO",
    image: "/images/team/corey-silverman.png",
    bio: "Alfred University graduate (1998). Glassblowing artist and co-owner of Prism Glassworks.",
  },
  {
    name: "Jason Davoli",
    role: "New York Lead",
    location: "New York, NY",
    image: "/images/team/jason-davoli.png",
    bio: "Alfred University trained master fabricator. Studied under sculptor Albert Paley. Founder of JDavoliDesign Inc.",
  },
  {
    name: "Boris Kostov",
    role: "Las Vegas Lead",
    location: "Las Vegas, NV",
    image: "/images/team/boris-kostov.png",
    bio: "Classically trained designer and sculptor exploring light, fire, and unseen universal energies as artistic mediums.",
  },
];

const locations = [
  { city: "Santa Cruz", state: "CA", type: "Headquarters" },
  { city: "New York", state: "NY", type: "Satellite" },
  { city: "Las Vegas", state: "NV", type: "Satellite" },
  { city: "Denver", state: "CO", type: "Satellite" },
  { city: "Portland", state: "OR", type: "Satellite" },
];

export default function AboutPage() {
  return (
    <div className="relative pt-32 pb-20">
      <AnimatedBackground />

      <div className="relative z-10">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <ScrollReveal>
            <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-4">
              Who We Are
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
              About
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-xl text-white/50 max-w-3xl leading-relaxed">
              Forging art, structure, and story into experience. A creative
              fabrication & design studio headquartered in Santa Cruz, California.
            </p>
          </ScrollReveal>
        </section>

        {/* Workshop hero image */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <ScrollReveal>
            <div className="relative aspect-[21/9] overflow-hidden rounded-lg">
              <Image
                src="/images/about/workshop.jpeg"
                alt="Numinous workshop"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-numinous-black/60 via-transparent to-transparent" />
            </div>
          </ScrollReveal>
        </section>

        {/* Mission */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-numinous-ember/5 rounded-full blur-[120px]" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <ScrollReveal>
              <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-6">
                Our Mission
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-heading font-bold leading-tight mb-8">
                We believe in the power of{" "}
                <span className="text-gradient">physical experience</span> to move,
                inspire, and transform.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-lg text-white/40 max-w-2xl mx-auto">
                In a world of screens, we forge real connections through tangible
                art that you can touch, feel, and stand inside of. Every weld,
                every finish, every flame is intentional.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Featured Video — Fata Morgana Kinetic Sculpture by Orion Fredericks */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <ScrollReveal>
            <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-4">
              In The Press
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-10">
              The Art of Orion Fredericks
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-numinous-charcoal">
              <iframe
                src="https://player.vimeo.com/video/12452045?h=0&title=0&byline=0&portrait=0&color=ff6b35&dnt=1"
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                loading="lazy"
                title="Fata Morgana Kinetic Sculpture — Orion Fredericks"
              />
            </div>
            <p className="mt-4 text-sm text-white/40">
              Co-founder Orion Fredericks&apos; kinetic fire sculpture <em>Fata Morgana</em> at Maker Faire.{" "}
              <a
                href="https://vimeo.com/orionfredericks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-numinous-ember hover:text-numinous-fire transition-colors"
              >
                View more on Vimeo &rarr;
              </a>
            </p>
          </ScrollReveal>
        </section>


        {/* Full Team */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <ScrollReveal>
            <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-4">
              The People
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-16">
              Our Team
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.08}>
                <GlowCard className="overflow-hidden h-full">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-numinous-black via-transparent to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-heading font-semibold mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs tracking-widest uppercase text-numinous-ember mb-1">
                      {member.role}
                    </p>
                    {"location" in member && member.location && (
                      <p className="text-[10px] tracking-widest uppercase text-white/30 mb-3">
                        {member.location}
                      </p>
                    )}
                    <p className="text-sm text-white/40 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Locations */}
        <section className="relative py-32 overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <ScrollReveal>
              <p className="text-xs tracking-[0.4em] uppercase text-numinous-ember mb-4">
                Where We Are
              </p>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-16">
                Locations
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {locations.map((loc, i) => (
                <ScrollReveal key={loc.city} delay={i * 0.1}>
                  <GlowCard className="p-6 text-center">
                    <h3 className="text-lg font-heading font-semibold mb-1">
                      {loc.city}
                    </h3>
                    <p className="text-sm text-white/40 mb-2">{loc.state}</p>
                    <p className="text-[10px] tracking-widest uppercase text-numinous-ember">
                      {loc.type}
                    </p>
                  </GlowCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "/images/portfolio/the-portal.jpg",
              "/images/portfolio/echeveria.jpg",
              "/images/portfolio/le-attrata.jpg",
              "/images/portfolio/fata.jpg",
            ].map((src, i) => (
              <ScrollReveal key={src} delay={i * 0.1}>
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={src}
                    alt="Studio gallery"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 text-center py-20">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Visit our <span className="text-gradient">studio</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-lg text-white/50 mb-10">
              We welcome visitors by appointment. Come see the work up close and
              meet the team.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Link
              href="/faq#contact"
              className="inline-block px-10 py-4 bg-numinous-ember text-black font-medium text-sm tracking-widest uppercase hover:bg-numinous-fire transition-colors duration-300 glow-ember"
            >
              Schedule a Visit
            </Link>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}
