"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-numinous-black relative overflow-hidden">
      {/* Subtle animated background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-numinous-ember/5 blur-[120px] animate-pulse" />
      </div>

      <div className="text-center relative z-10">
        <h1 className="text-[10rem] md:text-[14rem] font-heading font-bold leading-none text-gradient select-none">
          404
        </h1>
        <p className="text-xl md:text-2xl text-white/50 tracking-widest uppercase mt-2 mb-2">
          Page not found
        </p>
        <p className="text-sm text-white/30 max-w-md mx-auto mb-12">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-3 bg-numinous-ember text-black text-sm tracking-widest uppercase font-semibold hover:bg-numinous-ember/90 transition-all duration-300"
          >
            Go Home
          </Link>
          <Link
            href="/portfolio"
            className="px-8 py-3 border border-white/20 text-white/60 text-sm tracking-widest uppercase hover:border-numinous-ember hover:text-numinous-ember transition-all duration-300"
          >
            View Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
