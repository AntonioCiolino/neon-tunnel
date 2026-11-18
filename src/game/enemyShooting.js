import { COLLISION_DEPTH } from "./tunnelGeometry";
import { distance3D } from "./world3d";

export function getEnemyFireInterval(level) {
  return Math.max(3, 8 - Math.max(0, level - 1) * 0.5);
}

export function selectEnemyShooter(game) {
  const eligible = game.obstacles.filter((obstacle) =>
    obstacle.lastShotLevel !== game.level &&
    distance3D(obstacle, game.player) > obstacle.radius + COLLISION_DEPTH + 4,
  );

  if (eligible.length === 0) return null;
  return eligible[Math.floor(game.random() * eligible.length)];
}
