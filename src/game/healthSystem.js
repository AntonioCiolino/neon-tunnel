export const MAX_HEALTH = 100;
export const ENEMY_PROJECTILE_DAMAGE = 5;

export function getImpactDamage(obstacle) {
  if (obstacle.type === "starGnat") return 10;
  if (obstacle.type === "invader") return 40;
  return 25;
}

export function applyHealthDamage(game, damage) {
  if (!Number.isFinite(damage) || damage <= 0) return;

  game.health = Math.max(0, game.health - damage);
}
