import { COLLISION_DEPTH } from "./tunnelGeometry";

const ENEMY_PROJECTILE_SPEED = 36;
const ENEMY_PROJECTILE_RADIUS = 0.4;

export function fireEnemyProjectile(game, obstacle) {
  const dx = game.player.x - obstacle.x;
  const dy = game.player.y - obstacle.y;
  const dz = game.player.z - obstacle.z;
  const distance = Math.hypot(dx, dy, dz);
  if (distance <= 0) return null;

  const projectile = {
    x: obstacle.x,
    y: obstacle.y,
    z: obstacle.z,
    vx: (dx / distance) * ENEMY_PROJECTILE_SPEED,
    vy: (dy / distance) * ENEMY_PROJECTILE_SPEED,
    vz: (dz / distance) * ENEMY_PROJECTILE_SPEED,
    radius: ENEMY_PROJECTILE_RADIUS,
  };
  game.enemyProjectiles.push(projectile);
  return projectile;
}

function distanceToSegment(point, start, end) {
  const segment = {
    x: end.x - start.x,
    y: end.y - start.y,
    z: end.z - start.z,
  };
  const lengthSquared = segment.x ** 2 + segment.y ** 2 + segment.z ** 2;
  const projection = lengthSquared > 0
    ? Math.max(0, Math.min(1, (
      (point.x - start.x) * segment.x +
      (point.y - start.y) * segment.y +
      (point.z - start.z) * segment.z
    ) / lengthSquared))
    : 0;
  return Math.hypot(
    point.x - start.x - projection * segment.x,
    point.y - start.y - projection * segment.y,
    point.z - start.z - projection * segment.z,
  );
}

export function advanceEnemyProjectiles(game, delta) {
  let hits = 0;
  const remaining = [];

  for (const projectile of game.enemyProjectiles) {
    const next = {
      x: projectile.x + projectile.vx * delta,
      y: projectile.y + projectile.vy * delta,
      z: projectile.z + projectile.vz * delta,
    };

    if (distanceToSegment(game.player, projectile, next) <=
        projectile.radius + COLLISION_DEPTH) {
      hits += 1;
    } else if (next.z >= game.player.z - projectile.radius) {
      remaining.push({ ...projectile, ...next });
    }
  }

  game.enemyProjectiles = remaining;
  return hits;
}
