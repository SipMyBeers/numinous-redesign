"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-black text-white flex items-center justify-center min-h-screen">
        <div className="text-center px-6">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <button
            onClick={() => reset()}
            className="px-6 py-2 border border-white/20 text-white/60 text-sm uppercase hover:border-white hover:text-white transition-all"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
