export function updateObstacleMotion(obstacle, center, level, delta, collisionDepth) {
  if (!Number.isFinite(delta) || delta <= 0) return obstacle;

  const speed = 1.2 + Math.max(0, level - 1) * 0.35;
  const step = speed * Math.min(delta, 0.1);
  const dx = center.x - obstacle.x;
  const dy = center.y - obstacle.y;
  const distance = Math.hypot(dx, dy);
  const steeringStep = Math.min(step, distance);

  return {
    ...obstacle,
    x: distance > 0 ? obstacle.x + (dx / distance) * steeringStep : obstacle.x,
    y: distance > 0 ? obstacle.y + (dy / distance) * steeringStep : obstacle.y,
    z: Math.max(collisionDepth, obstacle.z - (level / 5) * Math.min(delta, 0.1)),
  };
}
