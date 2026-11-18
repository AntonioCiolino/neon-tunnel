import {
  COLLISION_DEPTH,
  MAX_HITS,
  ROUND_DISTANCE,
  ROUNDS_PER_LEVEL,
  SPAWN_DEPTH,
  SPAWN_INTERVAL,
  TUNNEL_RADIUS,
  TUNNEL_SPEED,
  getTunnelCenter,
} from "./tunnelGeometry";
import { distance3D, projectWorldPoint } from "./world3d";
import { updateObstacleMotion } from "./obstacleMotion";
import { emitGameEvent, explode, spawnObstacle, splitObstacle } from "./tunnelEffects";
import { advanceProjectiles, createProjectile, MAX_AMMO } from "./projectiles";

export {
  COLLISION_DEPTH,
  MAX_HITS,
  TUNNEL_RADIUS,
  TUNNEL_SPEED,
  getTunnelCenter,
  isObstacleCollision,
  projectTunnelPoint,
} from "./tunnelGeometry";



export function createTunnelSimulation(random = Math.random) {
  return {
    status: "playing",
    distance: 0,
    player: { ...getTunnelCenter(0), z: 0 },
    round: 1,
    level: 1,
    score: 0,
    hits: 0,
    obstacles: [],
    projectiles: [],
    ammo: MAX_AMMO,
    fragments: [],
    events: [],
    spawnTimer: 0,
    nextId: 0,
    random,
  };
}



// Mutates the game in place. Delta is in seconds and capped after long pauses.
export function updateTunnelSimulation(game, delta) {
  if (game.status !== "playing" || !Number.isFinite(delta) || delta <= 0) return;

  const dt = Math.min(delta, 0.1);
  const travel = TUNNEL_SPEED * dt;
  game.distance += travel;
  game.player = { ...getTunnelCenter(game.distance), z: game.distance };
  game.round = Math.floor(game.distance / ROUND_DISTANCE) + 1;
  const previousLevel = game.level;
  game.level = Math.floor((game.round - 1) / ROUNDS_PER_LEVEL) + 1;
  if (game.level > previousLevel) emitGameEvent(game, "levelUp");
  game.spawnTimer += dt;

  for (const obstacle of game.obstacles) {
    Object.assign(
      obstacle,
      updateObstacleMotion(
        obstacle,
        game.player,
        game.level + (game.player.z + SPAWN_DEPTH - obstacle.z) / SPAWN_DEPTH,
        dt,
      ),
    );
    obstacle.rotation += dt;
  }

  for (const target of advanceProjectiles(game, dt)) {
    game.score += Math.round((100 + target.z) / 10) * 10;
    splitObstacle(game, target);
    explode(game, target);
  }
  const projectileHits = new Set(
    game.events.length ? [] : [],
  );
  const impacts = game.obstacles.filter(
    (obstacle) => distance3D(obstacle, game.player) <= obstacle.radius + COLLISION_DEPTH,
  );
  game.obstacles = game.obstacles.filter(
    (obstacle) => obstacle.z > game.player.z + COLLISION_DEPTH &&
      !impacts.includes(obstacle),
  );
  game.hits = Math.min(MAX_HITS, game.hits + impacts.length);
  impacts.forEach(() => emitGameEvent(game, "hit"));

  for (const fragment of game.fragments) {
    fragment.x += fragment.vx * dt;
    fragment.y += fragment.vy * dt;
    fragment.z += fragment.vz * dt - travel;
    fragment.rotation += fragment.spin * dt;
    fragment.life -= dt;
  }
  game.fragments = game.fragments.filter((fragment) => fragment.life > 0 && fragment.z > 0);

  if (game.hits >= MAX_HITS) {
    game.status = "gameOver";
    emitGameEvent(game, "gameOver");
    return;
  }

  while (game.spawnTimer >= SPAWN_INTERVAL) {
    game.spawnTimer -= SPAWN_INTERVAL;
    for (let i = 0; i < game.level; i += 1) {
      spawnObstacle(game);
      game.obstacles[game.obstacles.length - 1].z += game.player.z;
    }
  }
}

// Screen coordinates and dimensions must use the same units, such as CSS pixels.
// Returns the destroyed obstacle, or null when the shot misses.
export function shootTunnelObstacle(game, x, y, width, height) {
  if (game.status !== "playing" || !Number.isFinite(x) || !Number.isFinite(y) ||
      game.score < 25) return null;

  game.score -= 25;
  emitGameEvent(game, "shoot");
  let target = null;
  for (const obstacle of game.obstacles) {
    const projected = projectWorldPoint(obstacle, game.player, width, height);
    if (!projected) continue;
    const radius = Math.max(12, obstacle.radius * projected.scale);
    if (Math.hypot(x - projected.x, y - projected.y) <= radius &&
        (!target || obstacle.z < target.z)) {
      target = obstacle;
    }
  }

  if (!target) return null;
  game.obstacles = game.obstacles.filter ( (obstacle) => obstacle !== target);
  const sizeMultiplier = target.size < 1 ? 2 : 1;
  game.score += Math.round((100 + target.z) / 10) * 10 * sizeMultiplier;
  splitObstacle(game, target);
  explode(game, target);
  return target;
}
