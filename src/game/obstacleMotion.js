import { TUNNEL_SPEED } from "./tunnelGeometry";

export function updateObstacleMotion(obstacle, player, level, delta) {
  if (!Number.isFinite(delta) || delta <= 0) return obstacle;

  const frameDelta = Math.min(delta, 0.1);
  if (obstacle.type === "starGnat") {
    let approaching = obstacle.gnatApproaching ?? true;
    let modeTimer = (obstacle.gnatModeTimer ?? 0) - frameDelta;
    if (modeTimer <= 0) {
      approaching = !approaching;
      modeTimer = approaching
        ? obstacle.gnatApproachDuration ?? 0.65
        : obstacle.gnatRetreatDuration ?? 0.45;
    }

    const motionTime = obstacle.rotation / 10;
    const orbitAngle = motionTime * 2.5 +
      obstacle.id * 2.399963229728653 + (obstacle.gnatOrbitPhase ?? 0);
    let offsetX = Math.cos(orbitAngle) * 2.2 +
      Math.sin(motionTime * 31 + (obstacle.gnatJitterPhaseX ?? obstacle.id ?? 0)) * 1.8 +
      Math.sin(motionTime * 67 + (obstacle.gnatJitterPhaseY ?? 0)) * 0.7;
    let offsetY = Math.sin(orbitAngle) * 2.2 +
      Math.sin(motionTime * 37 + (obstacle.gnatJitterPhaseY ?? 0)) * 1.8 +
      Math.sin(motionTime * 73 + (obstacle.gnatJitterPhaseX ?? obstacle.id ?? 0)) * 0.7;
    const offsetLength = Math.hypot(offsetX, offsetY);
    if (offsetLength > 4.2) {
      offsetX *= 4.2 / offsetLength;
      offsetY *= 4.2 / offsetLength;
    }

    return {
      ...obstacle,
      gnatApproaching: approaching,
      gnatModeTimer: modeTimer,
      x: player.x + offsetX,
      y: player.y + offsetY,
      z: obstacle.z + (approaching ? TUNNEL_SPEED - 0.8 : TUNNEL_SPEED + 1.2) * frameDelta,
    };
  }

  const speed = (0.5 + Math.max(0, level - 1) * 0.35) / 10 *
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
