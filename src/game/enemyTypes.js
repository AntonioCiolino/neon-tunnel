export const enemyTypes = [
  { type: "invader", skill: 1, size: 1, speed: 1 },
  { type: "drone", skill: 2, size: 0.9, speed: 1.15 },
  { type: "crystal", skill: 3, size: 0.8, speed: 1.3 },
  { type: "scout", skill: 4, size: 0.7, speed: 1.45 },
  { type: "hunter", skill: 5, size: 0.6, speed: 1.6 },
  { type: "sentinel", skill: 6, size: 0.5, speed: 1.75 },
];

export function getEnemyComplexityLimit(level) {
  return (level / 3) + 2;
}
