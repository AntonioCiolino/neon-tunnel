export default function GameControls({ paused, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={onToggle}
      className="rounded border border-emerald-400/50 px-3 py-2 text-sm text-emerald-300 hover:bg-emerald-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
    >
      {paused ? "Resume" : "Pause"}
    </button>
  );
}
