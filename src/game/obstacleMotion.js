export function updateObstacleMotion(obstacle, player, level, delta) {
  if (!Number.isFinite(delta) || delta <= 0) return obstacle;

  const speed = (1.2 + Math.max(0, level - 1) * 0.35) *
    (obstacle.speed || 1) / Math.max(obstacle.size || 1, 0.1);
  const step = speed * Math.min(delta, 0.1);
  const dx = player.x - obstacle.x;
  const dy = player.y - obstacle.y;
  const dz = player.z - obstacle.z;
  const distance = Math.hypot(dx, dy, dz);
  const steeringStep = Math.min(step, distance);
  const frameDelta = Math.min(delta, 0.1);

  return {
    ...obstacle,
    x: (distance > 0 ? obstacle.x + (dx / distance) * steeringStep : obstacle.x) +
      (obstacle.driftX || 0) * frameDelta,
    y: (distance > 0 ? obstacle.y + (dy / distance) * steeringStep : obstacle.y) +
      (obstacle.driftY || 0) * frameDelta,
    z: distance > 0 ? obstacle.z + (dz / distance) * steeringStep : obstacle.z,
  };
}
