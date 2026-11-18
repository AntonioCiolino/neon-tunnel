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
  isObstacleCollision,
  projectTunnelPoint,
} from "./tunnelGeometry";
import { updateObstacleMotion } from "./obstacleMotion";

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
    round: 1,
    level: 1,
    score: 0,
    hits: 0,
    obstacles: [],
    fragments: [],
    spawnTimer: 0,
    nextId: 0,
    random,
  };
}

function spawnObstacle(game) {
  const center = getTunnelCenter(game.distance + SPAWN_DEPTH);
  const angle = game.random() * Math.PI * 2;
  const offset = Math.sqrt(game.random()) * (TUNNEL_RADIUS - 1.6);
  game.obstacles.push({
    id: game.nextId++,
    x: center.x + Math.cos(angle) * offset,
    y: center.y + Math.sin(angle) * offset,
    z: SPAWN_DEPTH,
    radius: 1.2 + game.random() * 0.4,
    rotation: game.random() * Math.PI * 2,
  });
}

function explode(game, obstacle) {
  for (let i = 0; i < 12; i += 1) {
    const angle = game.random() * Math.PI * 2;
    const speed = 1 + game.random() * 5;
    game.fragments.push({
      x: obstacle.x,
      y: obstacle.y,
      z: obstacle.z,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      vz: (game.random() - 0.5) * 5,
      size: 0.15 + game.random() * 0.3,
      rotation: game.random() * Math.PI * 2,
      spin: (game.random() - 0.5) * 10,
      life: 0.5 + game.random() * 0.7,
    });
  }
}

// Mutates the game in place. Delta is in seconds and capped after long pauses.
export function updateTunnelSimulation(game, delta) {
  if (game.status !== "playing" || !Number.isFinite(delta) || delta <= 0) return;

  const dt = Math.min(delta, 0.1);
  const travel = TUNNEL_SPEED * dt;
  game.distance += travel;
  game.round = Math.floor(game.distance / ROUND_DISTANCE) + 1;
  game.level = Math.floor((game.round - 1) / ROUNDS_PER_LEVEL) + 1;
  game.spawnTimer += dt;

  for (const obstacle of game.obstacles) {
    Object.assign(
      obstacle,
      updateObstacleMotion(
        obstacle,
        getTunnelCenter(game.distance),
        game.level + (SPAWN_DEPTH - obstacle.z) / SPAWN_DEPTH,
        dt,
        COLLISION_DEPTH,
      ),
    );
    obstacle.rotation += dt;
  }

  const missed = game.obstacles.filter((obstacle) => obstacle.z <= COLLISION_DEPTH);
  const player = getTunnelCenter(game.distance);
  const impacts = missed.filter((obstacle) => isObstacleCollision(obstacle, player));
  game.obstacles = game.obstacles.filter((obstacle) => obstacle.z > COLLISION_DEPTH);
  game.hits = Math.min(MAX_HITS, game.hits + impacts.length);

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
    return;
  }

  while (game.spawnTimer >= SPAWN_INTERVAL) {
    game.spawnTimer -= SPAWN_INTERVAL;
    for (let i = 0; i < game.level; i += 1) {
      spawnObstacle(game);
    }
  }
}

// Screen coordinates and dimensions must use the same units, such as CSS pixels.
// Returns the destroyed obstacle, or null when the shot misses.
export function shootTunnelObstacle(game, x, y, width, height) {
  if (game.status !== "playing" || !Number.isFinite(x) || !Number.isFinite(y)) return null;

  let target = null;
  for (const obstacle of game.obstacles) {
    const projected = projectTunnelPoint(obstacle, game.distance, width, height);
    if (!projected) continue;
    const radius = Math.max(12, obstacle.radius * projected.scale);
    if (Math.hypot(x - projected.x, y - projected.y) <= radius &&
        (!target || obstacle.z < target.z)) {
      target = obstacle;
    }
  }

  if (!target) return null;
  game.obstacles = game.obstacles.filter ( (obstacle) => obstacle !== target);
  game.score += 100 + target.z;
  explode(game, target);
  return target;
}
