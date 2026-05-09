export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-numinous-black">
      <div className="flex flex-col items-center gap-6">
        {/* Pulsing ring spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-numinous-ember/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-numinous-ember rounded-full animate-spin" />
        </div>
        <p className="text-xs tracking-widest uppercase text-white/30">
          Loading
        </p>
      </div>
    </div>
  );
}
