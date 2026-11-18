export const TUNNEL_RADIUS = 5;
export const TUNNEL_SPEED = 18;
export const MAX_HITS = 3;

export const SPAWN_DEPTH = 65;
export const SPAWN_INTERVAL = 1.1;
export const ROUND_DISTANCE = 500;
export const ROUNDS_PER_LEVEL = 10;
export const COLLISION_DEPTH = 1.2;

// Distance is measured along the tunnel from its starting point.
export function getTunnelCenter(distance) {
  return {
    x: Math.sin(distance * 0.035) * 3 + Math.sin(distance * 0.012) * 2,
    y: Math.sin(distance * 0.027) * 2.5,
  };
}

export function isObstacleCollision(obstacle, player) {
  return Math.hypot(obstacle.x - player.x, obstacle.y - player.y) <= obstacle.radius;
}

// Points use world x/y and z as distance ahead of the camera.
export function projectTunnelPoint(point, distance, width, height) {
  if (point.z <= 0 || width <= 0 || height <= 0) return null;

  const camera = getTunnelCenter(distance);
  const scale = (Math.min(width, height) * 0.9) / point.z;
  return {
    x: width / 2 + (point.x - camera.x) * scale,
    y: height / 2 - (point.y - camera.y) * scale,
    scale,
  };
}
