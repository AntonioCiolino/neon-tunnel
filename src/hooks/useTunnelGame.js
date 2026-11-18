import { useCallback, useEffect, useRef, useState } from "react";
import { drawTunnel } from "../game/drawTunnel";
import {
  createTunnelSimulation,
  shootTunnelObstacle,
  updateTunnelSimulation,
} from "../game/tunnelSimulation";

export function useTunnelGame(onEvent) {
  const gameRef = useRef(null);
  if (!gameRef.current) gameRef.current = createTunnelSimulation();

  const elementRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [paused, setPaused] = useState(false);
  const [enemyHitCount, setEnemyHitCount] = useState(0);
  const pausedRef = useRef(false);
  const [hud, setHud] = useState(() => ({
    status: gameRef.current.status,
    score: gameRef.current.score,
    distance: Math.floor(gameRef.current.distance),
    hits: gameRef.current.hits,
    health: gameRef.current.health,
    maxHealth: gameRef.current.maxHealth,
    ammo: gameRef.current.ammo,
    round: gameRef.current.round,
    level: gameRef.current.level,
  }));
  const hudRef = useRef(hud);

  const canvasRef = useCallback((element) => {
    elementRef.current = element;
    setCanvas(element);
  }, []);

  const flushEvents = useCallback(() => {
    const events = gameRef.current.events.splice(0);
    events.forEach((event) => {
      if (event.type === "enemyHit") {
        setEnemyHitCount((count) => count + 1);
      }
      onEvent(event);
    });
  }, [onEvent]);

  const syncHud = useCallback(() => {
    const { status, score, hits, health, maxHealth, ammo, round, level } = gameRef.current;
    const distance = Math.floor(gameRef.current.distance);
    const previous = hudRef.current;
    if (status !== previous.status || score !== previous.score || distance !== previous.distance || hits !== previous.hits ||
        health !== previous.health || maxHealth !== previous.maxHealth ||
        ammo !== previous.ammo || round !== previous.round || level !== previous.level) {
      const next = { status, score, distance, hits, health, maxHealth, ammo, round, level };
      hudRef.current = next;
      setHud(next);
    }
  }, []);

  const pause = useCallback(() => {
    pausedRef.current = true;
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
    setPaused(false);
  }, []);

  const restart = useCallback(() => {
    gameRef.current = createTunnelSimulation();
    pausedRef.current = false;
    setPaused(false);
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
    flushEvents();
    syncHud();
    return result;
  }, [flushEvents, syncHud]);

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
      if (previousTime !== undefined && !pausedRef.current) {
        updateTunnelSimulation(gameRef.current, (time - previousTime) / 1000);
        flushEvents();
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
  }, [canvas, flushEvents, syncHud]);

  return { canvasRef, ...hud, paused, enemyHitCount, pause, resume, shoot, restart };
}
