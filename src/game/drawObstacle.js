import {
  COLLISION_DEPTH,
  getTunnelCenter,
  isObstacleCollision,
  projectTunnelPoint,
} from "./tunnelSimulation";

const WARNING_DEPTH = 14;

const obstacleVertices = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0],
  [0, -1, 0], [0, 0, 1], [0, 0, -1],
];
const obstacleEdges = [
  [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3],
  [1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5],
];

export function drawObstacle(ctx, obstacle, distance, width, height) {
  const obstacleRadius = obstacle.radius || 1;
  const points = obstacleVertices.map(([x, y, z]) =>
    projectTunnelPoint({
      x: obstacle.x + x * obstacleRadius,
      y: obstacle.y + y * obstacleRadius,
      z: obstacle.z + z * obstacleRadius * 0.55,
    }, distance, width, height),
  );
  const warning = obstacle.z <= WARNING_DEPTH &&
    isObstacleCollision(obstacle, getTunnelCenter(distance));
  const perspective = projectTunnelPoint(obstacle, distance, width, height);
  const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 140);

  ctx.save();
  ctx.strokeStyle = warning ? `rgba(255, ${Math.round(35 + 35 * pulse)}, ${Math.round(35 + 35 * pulse)}, 1)` : "#b8ff45";
  ctx.lineWidth = warning ? 2 + pulse : Math.max(1, Math.min(8, perspective.scale / 10));
  if (warning) {
    ctx.shadowColor = "#ff2020";
    ctx.shadowBlur = 8 + pulse * 18;
  }
  ctx.beginPath();
  obstacleEdges.forEach(([from, to]) => {
    const start = points[from];
    const end = points[to];
    if (!start || !end) return;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
  });
  ctx.stroke();
  ctx.restore();
}
