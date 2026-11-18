import { SPAWN_DEPTH, TUNNEL_RADIUS, getTunnelCenter } from "./tunnelGeometry";
import { enemyTypes, getEnemyComplexityLimit } from "./enemyTypes";

export function emitGameEvent(game, type) {
  game.events.push({ type });
}

export function spawnObstacle(game) {
  const eligibleTypes = enemyTypes.filter(
    ({ skill }) => skill <= getEnemyComplexityLimit(game.level),
  );
  const archetype = eligibleTypes[Math.floor(game.random() * eligibleTypes.length)];
  const center = getTunnelCenter(game.distance + SPAWN_DEPTH);
  if (game.swarmDistance !== game.distance) {
    const swarmAngle = game.random() * Math.PI * 2;
    const swarmOffset = Math.sqrt(game.random()) * (TUNNEL_RADIUS - 1.6);
    game.swarmCenter = {
      x: center.x + Math.cos(swarmAngle) * swarmOffset,
      y: center.y + Math.sin(swarmAngle) * swarmOffset,
    };
    game.swarmDistance = game.distance;
  }
  const angle = game.random() * Math.PI * 2;
  const offset = Math.sqrt(game.random()) * 0.8;
  game.obstacles.push({
    type: archetype.type,
    skill: archetype.skill,
    size: archetype.size,
    speed: archetype.speed,
    canSplit: Boolean(archetype.canSplit),
    id: game.nextId++,
    x: game.swarmCenter.x + Math.cos(angle) * offset,
    y: game.swarmCenter.y + Math.sin(angle) * offset,
    z: SPAWN_DEPTH,
    radius: (1.2 + game.random() * 0.4) * archetype.size,
    driftX: (game.random() - 0.5) * 1.8,
    driftY: (game.random() - 0.5) * 1.8,
    rotation: game.random() * Math.PI * 2,
  });
}

export function splitObstacle(game, obstacle) {
  if (!obstacle.canSplit) return false;

  emitGameEvent(game, "split");
  if (obstacle.type === "starPod") {
    const gnat = enemyTypes.find(({ type }) => type === "starGnat");
    for (let i = 0; i < 6; i += 1) {
      game.obstacles.push({
        ...obstacle,
        type: gnat.type,
        skill: gnat.skill,
        size: gnat.size,
        speed: gnat.speed,
        canSplit: false,
        id: game.nextId++,
        radius: obstacle.radius * 0.4,
        rotation: obstacle.rotation + (i * Math.PI * 2) / 6,
        lastShotLevel: undefined,
      });
    }
    return true;
  }

  const offset = obstacle.radius * 1.5;
  for (const direction of [-1, 1]) {
    game.obstacles.push({
      ...obstacle,
      id: game.nextId++,
      x: obstacle.x + offset * direction,
      driftX: direction * 2.5,
      radius: obstacle.radius * 0.5,
      size: obstacle.size * 0.5,
      canSplit: false,
      rotation: obstacle.rotation + Math.PI,
    });
  }
  return true;
}

export function explode(game, obstacle) {
  emitGameEvent(game, "explode");
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
