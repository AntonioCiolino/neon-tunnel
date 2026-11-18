import { SPAWN_DEPTH, getTunnelCenter } from "./tunnelGeometry";

const REWARD_HEALTH = 25;

export function spawnReward(game) {
  const center = getTunnelCenter(game.distance + SPAWN_DEPTH);
  game.obstacles.push({
    type: "reward",
    id: game.nextId++,
    x: center.x,
    y: center.y,
    z: game.distance + SPAWN_DEPTH,
    radius: 1.5,
  });
}

export function collectReward(game) {
  game.maxHealth += REWARD_HEALTH;
  game.health = Math.min(game.maxHealth, game.health + REWARD_HEALTH);
}
