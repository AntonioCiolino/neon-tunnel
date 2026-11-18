import { getTunnelCenter, projectTunnelPoint } from "./tunnelSimulation";

export function drawTunnel(ctx, game, width, height) {
  if (!ctx || !game || width <= 0 || height <= 0) return;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#020807";
  ctx.fillRect(0, 0, width, height);

  const ringCount = 15;
  const sides = 12;
  const radius = 7.5;
  const rings = [];

  for (let i = 0; i < ringCount; i += 1) {
    const depth = ((i * 10 - game.distance) % (ringCount * 10) + ringCount * 10) % (ringCount * 10);
    const center = getTunnelCenter(game.distance + depth);
    const ring = [];

    for (let side = 0; side < sides; side += 1) {
      const angle = (side / sides) * Math.PI * 2;
      ring.push(projectTunnelPoint({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
        z: depth,
      }, game.distance, width, height));
    }
    rings.push({ depth, points: ring });
  }

  ctx.lineWidth = 1;
  for (let i = 0; i < rings.length; i += 1) {
    const ring = rings[i];
    const alpha = Math.max(0.08, 0.62 - i * 0.035);
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

  const obstacleVertices = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0],
    [0, -1, 0], [0, 0, 1], [0, 0, -1],
  ];
  const obstacleEdges = [
    [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3],
    [1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5],
  ];

  for (const obstacle of game.obstacles) {
    const obstacleRadius = obstacle.radius || 1;
    const points = obstacleVertices.map(([x, y, z]) =>
      projectTunnelPoint({
        x: obstacle.x + x * obstacleRadius,
        y: obstacle.y + y * obstacleRadius,
        z: obstacle.z + z * obstacleRadius * 0.55,
      }, game.distance, width, height),
    );

    ctx.strokeStyle = "#b8ff45";
    ctx.lineWidth = 2;
    ctx.beginPath();
    obstacleEdges.forEach(([from, to]) => {
      const start = points[from];
      const end = points[to];
      if (!start || !end) return;
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
    });
    ctx.stroke();
  }

  for (const fragment of game.fragments) {
    const point = projectTunnelPoint(fragment, game.distance, width, height);
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
