import { getTunnelCenter } from "./tunnelGeometry";
import { createCamera, projectWorldPoint } from "./world3d";
import { drawObstacle } from "./drawObstacle";
import { drawProjectiles } from "./drawProjectiles";
import { drawEnemyProjectiles } from "./drawEnemyProjectiles";

export function drawTunnel(ctx, game, width, height) {
  if (!ctx || !game || width <= 0 || height <= 0) return;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#020807";
  ctx.fillRect(0, 0, width, height);

  const ringCount = 15;
  const sides = 12;
  const radius = 7.5;
  const camera = createCamera(game.player);
  const rings = [];

  for (let i = 0; i < ringCount; i += 1) {
    const depth = ((i * 10 - game.distance) % (ringCount * 10) + ringCount * 10) % (ringCount * 10);
    const center = getTunnelCenter(game.distance + depth);
    const ring = [];

    for (let side = 0; side < sides; side += 1) {
      const angle = (side / sides) * Math.PI * 2;
      ring.push(projectWorldPoint({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
        z: game.distance + depth,
      }, camera, width, height));
    }
    rings.push({ depth, points: ring });
  }

  ctx.lineWidth = 1;
  for (let i = 0; i < rings.length; i += 1) {
    const ring = rings[i];
    const alpha = Math.max(0.08, (i % 2 === 0 ? 0.62 : 0.3) - i * 0.025);
    ctx.strokeStyle = `rgba(40, 255, 166, ${alpha})`;
    ctx.beginPath();

    ring.points.forEach((point, side) => {
      const next = ring.points[(side + 1) % sides];
      if (!point || !next) return;
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(next.x, next.y);
    });

    ctx.stroke();
  }

  for (let side = 0; side < sides; side += 1) {
    ctx.strokeStyle = side % 2 === 0
      ? "rgba(40, 255, 166, 0.42)"
      : "rgba(40, 255, 166, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let i = 0; i < rings.length - 1; i += 1) {
      const current = rings[i];
      const next = rings[i + 1];
      if (next.depth <= current.depth) continue;

      const start = current.points[side];
      const end = next.points[side];
      if (!start || !end) continue;
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
    }

    ctx.stroke();
  }

  for (const obstacle of game.obstacles) {
    drawObstacle(ctx, obstacle, game.player, width, height);
  }

  drawProjectiles(ctx, game.projectiles, camera, width, height);
  drawEnemyProjectiles(ctx, game.enemyProjectiles, camera, width, height);

  for (const fragment of game.fragments) {
    const point = projectWorldPoint(fragment, camera, width, height);
    if (!point) continue;

    const size = Math.max(3, Math.min(15, (fragment.size || 0.3) * point.scale));
    const angle = Math.atan2(fragment.vy || 0, fragment.vx || 0);
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(angle);
    ctx.fillStyle = "#b8ff45";
    ctx.strokeStyle = "#e6ffb0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size * 0.7, -size * 0.55);
    ctx.lineTo(-size * 0.35, size * 0.75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}
