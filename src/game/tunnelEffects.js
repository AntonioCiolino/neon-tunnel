import { SPAWN_DEPTH, TUNNEL_RADIUS, getTunnelCenter } from "./tunnelGeometry";

export function spawnObstacle(game) {
  const center = getTunnelCenter(game.distance + SPAWN_DEPTH);
  const angle = game.random() * Math.PI * 2;
  const offset = Math.sqrt(game.random()) * (TUNNEL_RADIUS - 1.6);
  game.obstacles.push({
    id: game.nextId++,
    x: center.x + Math.cos(angle) * offset,
    y: center.y + Math.sin(angle) * offset,
    z: SPAWN_DEPTH,
    radius: 1.2 + game.random() * 0.4,
    driftX: (game.random() - 0.5) * 1.8,
    driftY: (game.random() - 0.5) * 1.8,
    rotation: game.random() * Math.PI * 2,
  });
}

export function explode(game, obstacle) {
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
