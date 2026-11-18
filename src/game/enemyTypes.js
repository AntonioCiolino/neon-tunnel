export const enemyTypes = [
  { type: "invader", skill: 1, size: 1, speed: 1 },
  { type: "drone", skill: 2, size: 0.9, speed: 1.15 },
  { type: "crystal", skill: 2, size: 0.8, speed: 1.3 },
  { type: "scout", skill: 2, size: 0.7, speed: 1.45, canSplit: true },
  { type: "hunter", skill: 2, size: 0.6, speed: 1.6, canSplit: true },
  { type: "sentinel", skill: 2, size: 0.5, speed: 1.75, canSplit: true },
  { type: "starPod", skill: 2, size: 0.8, speed: 1.3, canSplit: true },
  { type: "starGnat", skill: 2, size: 0.4, speed: 1.45 },
];

export function getEnemyComplexityLimit(level) {
  return (level / 3) + 2;
}
