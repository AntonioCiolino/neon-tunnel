import { DEFAULT_CAMERA_FOV } from "./world3d";

export const MAX_AMMO = 20;
const PROJECTILE_SPEED = 90;
const PROJECTILE_RADIUS = 0.25;
const PROJECTILE_RANGE = 150;

export function createProjectile(game, x, y, width, height) {
  if (game.ammo <= 0 || width <= 0 || height <= 0) return null;

  const focalLength = Math.min(width, height) /
    (2 * Math.tan(DEFAULT_CAMERA_FOV / 2));
  const direction = {
    x: (x - width / 2) / focalLength,
    y: -(y - height / 2) / focalLength,
    z: 1,
  };
  const length = Math.hypot(direction.x, direction.y, direction.z);
  game.ammo -= 1;
  return {
    x: game.player.x,
    y: game.player.y,
    z: game.player.z,
    vx: (direction.x / length) * PROJECTILE_SPEED,
    vy: (direction.y / length) * PROJECTILE_SPEED,
    vz: (direction.z / length) * PROJECTILE_SPEED,
    radius: PROJECTILE_RADIUS,
  };
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

export function advanceProjectiles(game, delta) {
  const hits = [];
  const hitObstacles = new Set();
  const remaining = [];

  for (const projectile of game.projectiles) {
    const next = {
      x: projectile.x + projectile.vx * delta,
      y: projectile.y + projectile.vy * delta,
      z: projectile.z + projectile.vz * delta,
    };
    const target = game.obstacles.find((obstacle) =>
      !hitObstacles.has(obstacle) &&
      distanceToSegment(obstacle, projectile, next) <=
        obstacle.radius + projectile.radius,
    );

    if (target) {
      hitObstacles.add(target);
      hits.push(target);
      game.ammo = Math.min(MAX_AMMO, game.ammo + 1);
    } else if (next.z <= game.player.z + PROJECTILE_RANGE) {
      remaining.push({ ...projectile, ...next });
    } else {
      game.ammo = Math.min(MAX_AMMO, game.ammo + 1);
    }
  }

  game.projectiles = remaining;
  return hits;
}
