export default function ProgressionHud({ round, level, distance }) {
  return (
    <div className="absolute left-1/2 top-20 z-10 flex -translate-x-1/2 gap-6 border border-emerald-400/40 bg-black/70 px-5 py-2 font-mono text-sm uppercase tracking-widest sm:text-base">
      <span>Round <strong className="text-white">{round}</strong></span>
      <span>Level <strong className="text-white">{level}</strong></span>
      <span>Distance <strong className="text-white">{distance}</strong></span>
    </div>
  );
}
