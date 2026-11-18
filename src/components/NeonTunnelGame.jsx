import { useState } from "react";
import TunnelCanvas from "./TunnelCanvas.jsx";
import ProgressionHud from "./ProgressionHud.jsx";
import LevelAdvanceToast from "./LevelAdvanceToast.jsx";
import DamageFlash from "./DamageFlash.jsx";
import { useTunnelGame } from "../hooks/useTunnelGame.js";

function GameSession({ onRestart }) {
  const { canvasRef, shoot: onShoot, status, score, distance, hits, round, level } = useTunnelGame();
  const hud = { status, score, distance, hits, round, level };
  const gameOver = hud.status !== "playing";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020807] text-emerald-300">
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 sm:p-6">
        <h1 className="text-lg font-black uppercase tracking-[0.25em] text-emerald-300 sm:text-2xl">
          Neon Tunnel
        </h1>
        <div className="flex gap-5 font-mono text-sm sm:gap-8 sm:text-base">
          <span> SCORE <strong className="text-white">{hud.score}</strong></span>
          <span> HITS <strong className="text-rose-400">{hud.hits}/3</strong></span>
        </div>
      </header>

      <ProgressionHud round={hud.round} level={hud.level} distance={hud.distance} />
      <LevelAdvanceToast level={hud.level} />
      <DamageFlash hits={hud.hits} />
      <TunnelCanvas canvasRef={canvasRef} onShoot={onShoot} />

      {gameOver && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/75 p-6 text-center">
          <section className="max-w-md border border-emerald-400/60 bg-black/90 p-8 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
            <p className="mb-2 font-mono uppercase tracking-[0.3em] text-rose-400">Game over</p>
            <h2 className="mb-3 text-4xl font-black text-white">Tunnel breached</h2>
            <p className="mb-6 text-emerald-200">Final score: {hud.score}</p>
            <button
              onClick={onRestart}
              className="bg-emerald-400 px-6 py-3 font-bold uppercase tracking-widest text-black hover:bg-emerald-300"
            >
              Play again
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default function NeonTunnelGame() {
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);

  if (started) {
    return <GameSession key={run} onRestart={() => setRun((value) => value + 1)} />;
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#020807] px-6 text-center text-emerald-300">
      <section className="max-w-xl">
        <p className="mb-4 font-mono uppercase tracking-[0.35em] text-emerald-500">A wireframe survival run</p>
        <h1 className="mb-5 text-5xl font-black uppercase tracking-tight text-white sm:text-7xl">
          Neon Tunnel
        </h1>
        <p className="mb-8 text-lg text-emerald-200">
          Blast the incoming shapes. Three impacts end your run.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="border border-emerald-400 bg-emerald-400 px-8 py-4 font-bold uppercase tracking-[0.2em] text-black hover:bg-emerald-300"
        >
          Start game
        </button>
      </section>
    </main>
  );
}
