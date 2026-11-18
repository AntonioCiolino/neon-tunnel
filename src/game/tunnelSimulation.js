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
import { advanceEnemyProjectiles, fireEnemyProjectile } from "./enemyProjectiles";
import { getEnemyFireInterval, selectEnemyShooter } from "./enemyShooting";
import { applyHealthDamage, getImpactDamage, MAX_HEALTH } from "./healthSystem";

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
    health: MAX_HEALTH,
    maxHealth: MAX_HEALTH,
    hits: 0,
    obstacles: [],
    projectiles: [],
    enemyProjectiles: [],
    enemyFireTimer: 0,
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

  const projectileHits = advanceProjectiles(game, dt);
  for (const target of projectileHits) {
    game.score += Math.round((100 + target.z) / 10) * 10;
    splitObstacle(game, target);
    explode(game, target);
  }
  game.obstacles = game.obstacles.filter(
    (obstacle) => !projectileHits.includes(obstacle),
  );
  const impacts = game.obstacles.filter(
    (obstacle) => distance3D(obstacle, game.player) <= obstacle.radius + COLLISION_DEPTH,
  );
  game.obstacles = game.obstacles.filter(
    (obstacle) => obstacle.z > game.player.z + COLLISION_DEPTH &&
      !impacts.includes(obstacle),
  );
  game.hits = Math.min(MAX_HITS, game.hits + impacts.length);
  impacts.forEach((obstacle) => {
    applyHealthDamage(game, getImpactDamage(obstacle));
    emitGameEvent(game, "hit");
  });

  for (const fragment of game.fragments) {
    fragment.x += fragment.vx * dt;
    fragment.y += fragment.vy * dt;
    fragment.z += fragment.vz * dt - travel;
    fragment.rotation += fragment.spin * dt;
    fragment.life -= dt;
  }
  game.fragments = game.fragments.filter((fragment) => fragment.life > 0 && fragment.z > 0);

  game.enemyFireTimer += dt;
  if (game.enemyFireTimer >= getEnemyFireInterval(game.level)) {
    game.enemyFireTimer -= getEnemyFireInterval(game.level);
    const shooter = selectEnemyShooter(game);
    if (shooter && fireEnemyProjectile(game, shooter)) {
      shooter.lastShotLevel = game.level;
      if (shooter.type === "starGnat") emitGameEvent(game, "gnatFire");
    }
  }
  const enemyHits = advanceEnemyProjectiles(game, dt);
  game.score -= enemyHits * 10;
  for (let i = 0; i < enemyHits; i += 1) emitGameEvent(game, "enemyHit");

  if (game.health <= 0) {
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
  if (game.status !== "playing" || !Number.isFinite(x) || !Number.isFinite(y)) return null;

  const projectile = createProjectile(game, x, y, width, height);
  if (!projectile) return null;

  game.score -= 25;
  emitGameEvent(game, "shoot");
  game.projectiles.push(projectile);
  return projectile;
}
