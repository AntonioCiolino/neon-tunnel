import { useCallback, useEffect, useRef, useState } from "react";
import { drawTunnel } from "../game/drawTunnel";
import {
  createTunnelSimulation,
  shootTunnelObstacle,
  updateTunnelSimulation,
} from "../game/tunnelSimulation";

export function useTunnelGame() {
  const gameRef = useRef(null);
  if (!gameRef.current) gameRef.current = createTunnelSimulation();

  const elementRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [hud, setHud] = useState(() => ({
    status: gameRef.current.status,
    score: gameRef.current.score,
    distance: Math.floor(gameRef.current.distance),
    hits: gameRef.current.hits,
    round: gameRef.current.round,
    level: gameRef.current.level,
  }));
  const hudRef = useRef(hud);

  const canvasRef = useCallback((element) => {
    elementRef.current = element;
    setCanvas(element);
  }, []);

  const syncHud = useCallback(() => {
    const { status, score, hits, round, level } = gameRef.current;
    const distance = Math.floor(gameRef.current.distance);
    const previous = hudRef.current;
    if (status !== previous.status || score !== previous.score || distance !== previous.distance || hits !== previous.hits ||
        round !== previous.round || level !== previous.level) {
      const next = { status, score, distance, hits, round, level };
      hudRef.current = next;
      setHud(next);
    }
  }, []);

  const restart = useCallback(() => {
    gameRef.current = createTunnelSimulation();
    syncHud();
  }, [syncHud]);

  const shoot = useCallback((clientX, clientY) => {
    const element = elementRef.current;
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    const result = shootTunnelObstacle(
      gameRef.current,
      clientX - rect.left,
      clientY - rect.top,
      rect.width,
      rect.height,
    );
    syncHud();
    return result;
  }, [syncHud]);

  useEffect(() => {
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let frame;
    let previousTime;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width <= 0 || height <= 0) return;

      const ratio = window.devicePixelRatio || 1;
      const pixelWidth = Math.max(1, Math.round(width * ratio));
      const pixelHeight = Math.max(1, Math.round(height * ratio));
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      ctx.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0);
    };

    const animate = (time) => {
      if (previousTime !== undefined) {
        updateTunnelSimulation(gameRef.current, (time - previousTime) / 1000);
        syncHud();
      }
      previousTime = time;
      drawTunnel(ctx, gameRef.current, width, height);
      frame = requestAnimationFrame(animate);
    };

    resize();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(canvas);
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [canvas, syncHud]);

  return { canvasRef, ...hud, shoot, restart };
}
