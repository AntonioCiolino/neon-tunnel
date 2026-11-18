import { TUNNEL_SPEED } from "./tunnelGeometry";

export function updateObstacleMotion(obstacle, player, level, delta) {
  if (!Number.isFinite(delta) || delta <= 0) return obstacle;

  const frameDelta = Math.min(delta, 0.1);
  if (obstacle.type === "starGnat") {
    const orbitAngle = obstacle.rotation / 5 + obstacle.id * 2.399963229728653;
    return {
      ...obstacle,
      x: player.x + Math.cos(orbitAngle) * 2.5,
      y: player.y + Math.sin(orbitAngle) * 2.5,
      z: obstacle.z + (TUNNEL_SPEED + 2.5) * frameDelta,
    };
  }

  const speed = (0.5 + Math.max(0, level - 1) * 0.35) / 5 *
    (obstacle.speed || 1);
  const step = speed * Math.min(delta, 0.1);
  const dx = player.x - obstacle.x;
  const dy = player.y - obstacle.y;
  const dz = player.z - obstacle.z;
  const distance = Math.hypot(dx, dy, dz);
  const steeringStep = Math.min(step, distance);
  return {
    ...obstacle,
    x: (distance > 0 ? obstacle.x + (dx / distance) * steeringStep : obstacle.x) +
      (obstacle.driftX || 0) * frameDelta / 5 +
      Math.sin((obstacle.rotation || 0) * 31 + obstacle.id) * 2.5 * frameDelta / 5,
    y: (distance > 0 ? obstacle.y + (dy / distance) * steeringStep : obstacle.y) +
      (obstacle.driftY || 0) * frameDelta / 5 +
      Math.cos((obstacle.rotation || 0) * 37 + obstacle.id) * 2.5 * frameDelta / 5,
    z: distance > 0 ? obstacle.z + (dz / distance) * steeringStep : obstacle.z,
  };
}
