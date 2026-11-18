import { projectWorldPoint } from "./world3d";

export function drawEnemyProjectiles(ctx, projectiles, camera, width, height) {
  for (const projectile of projectiles) {
    const point = projectWorldPoint(projectile, camera, width, height);
    if (!point) continue;

    const trail = projectWorldPoint({
      x: projectile.x - projectile.vx * 0.12,
      y: projectile.y - projectile.vy * 0.12,
      z: projectile.z - projectile.vz * 0.12,
    }, camera, width, height);

    ctx.save();
    ctx.strokeStyle = "#ff426d";
    ctx.fillStyle = "#fff0f4";
    ctx.shadowColor = "#ff174f";
    ctx.shadowBlur = 16;
    ctx.lineWidth = Math.max(3, Math.min(8, point.scale * projectile.radius));
    if (trail) {
      ctx.beginPath();
      ctx.moveTo(trail.x, trail.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(4, Math.min(12, point.scale * projectile.radius * 1.5)), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
