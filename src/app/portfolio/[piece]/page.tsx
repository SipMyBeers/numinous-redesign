import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { pieces } from "../pieces";

interface Props {
  params: Promise<{ piece: string }>;
}

export async function generateStaticParams() {
  return pieces.map((p) => ({ piece: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { piece } = await params;
  const found = pieces.find((p) => p.id === piece);
  if (!found) return { title: "Piece Not Found | Numinous Designs" };
  return {
    title: `${found.name} | Numinous Designs`,
    description: found.description,
    openGraph: {
      title: `${found.name} | Numinous Designs`,
      description: found.description,
      images: [found.image],
    },
  };
}

export default async function PiecePage({ params }: Props) {
  const { piece: slug } = await params;
  const piece = pieces.find((p) => p.id === slug);
  if (!piece) notFound();

  const idx = pieces.findIndex((p) => p.id === slug);
  const prev = idx > 0 ? pieces[idx - 1] : null;
  const next = idx < pieces.length - 1 ? pieces[idx + 1] : null;

  return (
    <div className="relative z-10 min-h-screen bg-numinous-black">
      {/* Floating back button — always visible on every scroll position */}
      <Link
        href="/portfolio"
        aria-label="Back to portfolio"
        className="fixed top-[max(1rem,env(safe-area-inset-top))] left-4 md:top-28 md:left-12 z-[60] inline-flex items-center gap-2 text-xs md:text-sm text-white/85 hover:text-white transition-colors duration-200 backdrop-blur-md bg-black/55 hover:bg-black/70 px-3.5 py-2 md:px-4 md:py-2 rounded-full border border-white/15"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" />
        </svg>
        <span className="font-medium tracking-wide">Portfolio</span>
      </Link>

      {/* ===== CINEMATIC HERO ===== */}
      <section className="relative h-[85vh] overflow-hidden">
        <Image
          src={piece.image}
          alt={piece.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-numinous-black via-numinous-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-numinous-black/50 via-transparent to-numinous-black/50" />

        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-12 z-10">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-numinous-ember mb-3">
              {piece.category}{piece.year ? ` · ${piece.year}` : ""}
            </p>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold leading-[0.9] mb-4">
              {piece.name}
            </h1>
            <p className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed">
              {piece.description}
            </p>
          </div>
        </div>
      </section>

      {/* ===== VIDEO SHOWCASE ===== */}
      {piece.vimeoId && (
        <section className="relative py-20 px-6 md:px-12">
          <div className="max-w-5xl mx-auto space-y-12">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-numinous-ember mb-6">
                Watch in Motion
              </p>
              <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-numinous-charcoal">
                <iframe
                  src={`https://player.vimeo.com/video/${piece.vimeoId}?color=ff6b35&byline=0&portrait=0&title=0&dnt=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`${piece.name} video`}
                />
              </div>
            </div>
            {piece.vimeoId2 && (
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-numinous-ember mb-6">
                  {piece.vimeoLabel2 || "Behind the Scenes"}
                </p>
                <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-numinous-charcoal">
                  <iframe
                    src={`https://player.vimeo.com/video/${piece.vimeoId2}?color=ff6b35&byline=0&portrait=0&title=0&dnt=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={`${piece.name} behind the scenes`}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== DETAILS GRID ===== */}
      <section className="relative py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Long description */}
          {piece.longDescription && (
            <div className="max-w-3xl mb-20">
              <p className="text-[10px] tracking-[0.4em] uppercase text-numinous-ember mb-6">
                About This Piece
              </p>
              <p className="text-lg md:text-xl text-white/60 leading-relaxed">
                {piece.longDescription}
              </p>
            </div>
          )}

          {/* Specs cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            <div className="border border-white/5 rounded-lg p-6 bg-white/[0.02]">
              <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">Material</p>
              <p className="text-sm text-white/80 font-medium">{piece.material}</p>
            </div>
            {piece.dimensions && (
              <div className="border border-white/5 rounded-lg p-6 bg-white/[0.02]">
                <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">Dimensions</p>
                <p className="text-sm text-white/80 font-medium">{piece.dimensions}</p>
              </div>
            )}
            {piece.artist && (
              <div className="border border-white/5 rounded-lg p-6 bg-white/[0.02]">
                <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">Artist</p>
                <p className="text-sm text-white/80 font-medium">{piece.artist}</p>
              </div>
            )}
            {piece.location && (
              <div className="border border-white/5 rounded-lg p-6 bg-white/[0.02]">
                <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">Location</p>
                <p className="text-sm text-white/80 font-medium">{piece.location}</p>
              </div>
            )}
            {piece.year && (
              <div className="border border-white/5 rounded-lg p-6 bg-white/[0.02]">
                <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">Year</p>
                <p className="text-sm text-white/80 font-medium">{piece.year}</p>
              </div>
            )}
            {piece.availability && (
              <div className="border border-numinous-ember/20 rounded-lg p-6 bg-numinous-ember/[0.04] col-span-2">
                <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">Availability</p>
                <p className="text-sm text-numinous-ember font-medium">{piece.availability}</p>
              </div>
            )}
          </div>

          {/* Techniques */}
          {piece.techniques && piece.techniques.length > 0 && (
            <div className="mb-20">
              <p className="text-[10px] tracking-[0.4em] uppercase text-numinous-ember mb-6">
                Techniques & Process
              </p>
              <div className="flex flex-wrap gap-3">
                {piece.techniques.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 text-xs tracking-wider uppercase text-white/60 border border-white/10 rounded-full bg-white/[0.02] hover:border-numinous-ember/30 hover:text-white/80 transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== EXTRA IMAGES ===== */}
      {piece.extraImages && piece.extraImages.length > 0 && (
        <section className="relative py-10 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] tracking-[0.4em] uppercase text-numinous-ember mb-6">
              Gallery
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {piece.extraImages.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/5"
                >
                  <Image
                    src={src}
                    alt={`${piece.name} detail ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="relative py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="border border-white/5 rounded-lg p-8 md:p-12 bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2">
                Interested in {piece.name}?
              </h2>
              <p className="text-sm text-white/40">
                Commission a similar piece, inquire about availability, or discuss your own vision.
              </p>
            </div>
            <Link
              href="/faq#contact"
              className="shrink-0 px-8 py-4 bg-numinous-ember text-black font-medium text-xs tracking-widest uppercase hover:bg-numinous-fire transition-colors duration-300"
            >
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PREV / NEXT NAV ===== */}
      <section className="relative border-t border-white/5">
        <div className="grid grid-cols-2">
          {prev ? (
            <Link
              href={`/portfolio/${prev.id}`}
              className="group relative p-8 md:p-12 hover:bg-white/[0.02] transition-colors duration-300 border-r border-white/5"
            >
              <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">
                ← Previous
              </p>
              <p className="text-lg md:text-xl font-heading font-bold group-hover:text-numinous-ember transition-colors duration-300">
                {prev.name}
              </p>
            </Link>
          ) : (
            <div className="border-r border-white/5" />
          )}
          {next ? (
            <Link
              href={`/portfolio/${next.id}`}
              className="group relative p-8 md:p-12 hover:bg-white/[0.02] transition-colors duration-300 text-right"
            >
              <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">
                Next →
              </p>
              <p className="text-lg md:text-xl font-heading font-bold group-hover:text-numinous-ember transition-colors duration-300">
                {next.name}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </div>
  );
}
