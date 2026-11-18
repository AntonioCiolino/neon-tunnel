export default function HealthHud({ health, maxHealth }) {
  const safeMaxHealth = Math.max(0, maxHealth);
  const safeHealth = Math.max(0, Math.min(health, safeMaxHealth));
  const damagePercent = safeMaxHealth > 0
    ? ((safeMaxHealth - safeHealth) / safeMaxHealth) * 100
    : 100;

  return (
    <div className="w-48 font-mono text-xs uppercase tracking-widest text-emerald-300">
      <div className="mb-1 flex justify-between">
        <span>HP</span>
        <span>{safeHealth}/{safeMaxHealth}</span>
      </div>
      <div
        role="progressbar"
        aria-label="Health"
        aria-valuemin={0}
        aria-valuemax={safeMaxHealth}
        aria-valuenow={safeHealth}
        className="flex h-3 w-full overflow-hidden border border-white/30 bg-rose-600"
      >
        <div
          className="h-full bg-emerald-400"
          style={{ width: `${100 - damagePercent}%` }}
        />
        <div
          aria-hidden="true"
          className="h-full flex-1 bg-rose-600"
        />
      </div>
    </div>
  );
}
