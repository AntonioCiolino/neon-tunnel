import { isObstacleCollision } from "./tunnelGeometry";
import { createCamera, projectWorldPoint } from "./world3d";
import { enemyMeshes } from "./enemyMeshes";

const WARNING_DEPTH = 14;


export function drawObstacle(ctx, obstacle, player, width, height) {
  const obstacleRadius = obstacle.radius || 1;
  const mesh = enemyMeshes[obstacle.type] || enemyMeshes.invader;
  const camera = createCamera(player);
  const points = mesh.vertices.map(([x, y, z]) =>
    projectWorldPoint({
      x: obstacle.x + x * obstacleRadius,
      y: obstacle.y + y * obstacleRadius,
      z: obstacle.z + z * obstacleRadius * 0.55,
    }, camera, width, height),
  );
  const warning = obstacle.z - player.z <= WARNING_DEPTH &&
    isObstacleCollision(obstacle, player);
  const perspective = projectWorldPoint(obstacle, camera, width, height);
  if (!perspective) return;

  if (obstacle.type === "reward") {
    const size = Math.max(6, Math.min(28, perspective.scale * obstacleRadius * 0.65));
    ctx.save();
    ctx.shadowColor = "#55ffb0";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#064b3b";
    ctx.strokeStyle = "#55ffb0";
    ctx.lineWidth = Math.max(2, size * 0.12);
    ctx.beginPath();
    ctx.arc(perspective.x, perspective.y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#e8fff4";
    ctx.lineWidth = Math.max(2, size * 0.22);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(perspective.x - size * 0.45, perspective.y);
    ctx.lineTo(perspective.x + size * 0.45, perspective.y);
    ctx.moveTo(perspective.x, perspective.y - size * 0.45);
    ctx.lineTo(perspective.x, perspective.y + size * 0.45);
    ctx.stroke();
    ctx.restore();
    return;
  }

  const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 140);

  ctx.save();
  ctx.strokeStyle = warning ? `rgba(255, ${Math.round(35 + 35 * pulse)}, ${Math.round(35 + 35 * pulse)}, 1)` : "#b8ff45";
  ctx.lineWidth = warning ? 2 + pulse : Math.max(1, Math.min(8, perspective.scale / 10));
  if (warning) {
    ctx.shadowColor = "#ff2020";
    ctx.shadowBlur = 8 + pulse * 18;
  }
  ctx.beginPath();
  mesh.edges.forEach(([from, to]) => {
    const start = points[from];
    const end = points[to];
    if (!start || !end) return;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
  });
  ctx.stroke();
  ctx.restore();
}
