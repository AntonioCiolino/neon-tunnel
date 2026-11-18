import { projectWorldPoint } from "./world3d";

export function drawProjectiles(ctx, projectiles, camera, width, height) {
  for (const projectile of projectiles) {
    const point = projectWorldPoint(projectile, camera, width, height);
    if (!point) continue;

    const trail = projectWorldPoint({
      x: projectile.x - projectile.vx * 0.12,
      y: projectile.y - projectile.vy * 0.12,
      z: projectile.z - projectile.vz * 0.12,
    }, camera, width, height);

    ctx.save();
    ctx.strokeStyle = "#55f7ff";
    ctx.fillStyle = "#e8ffff";
    ctx.shadowColor = "#55f7ff";
    ctx.shadowBlur = 12;
    ctx.lineWidth = Math.max(2, Math.min(6, point.scale * projectile.radius * 0.8));
    if (trail) {
      ctx.beginPath();
      ctx.moveTo(trail.x, trail.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(2, Math.min(7, point.scale * projectile.radius)), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
