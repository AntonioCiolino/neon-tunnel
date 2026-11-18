import { useEffect, useState } from "react";

export default function LevelAdvanceToast({ level }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (level <= 1) return undefined;

    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 2600);
    return () => window.clearTimeout(timeout);
  }, [level]);

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="border border-emerald-300/70 bg-black/80 px-8 py-4 text-center shadow-[0_0_30px_rgba(16,185,129,0.35)]">
        <p className="font-mono text-sm uppercase tracking-[0.35em] text-emerald-300">
          Level advanced
        </p>
        <p className="mt-1 text-3xl font-black uppercase tracking-widest text-white">
          Level {level}
        </p>
      </div>
    </div>
  );
}
