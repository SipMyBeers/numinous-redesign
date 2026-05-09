"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-numinous-black relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] rounded-full bg-red-500/5 blur-[100px]" />
      </div>

      <div className="text-center relative z-10">
        <div className="text-6xl mb-6 text-white/20 select-none font-heading">!</div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3 text-white">
          Something went wrong
        </h1>
        <p className="text-sm text-white/40 max-w-md mx-auto mb-10">
          An unexpected error occurred. You can try again or head back to the home page.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-numinous-ember text-black text-sm tracking-widest uppercase font-semibold hover:bg-numinous-ember/90 transition-all duration-300 cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3 border border-white/20 text-white/60 text-sm tracking-widest uppercase hover:border-numinous-ember hover:text-numinous-ember transition-all duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
