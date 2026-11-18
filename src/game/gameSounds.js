const SOUND_PATTERNS = {
  shoot: [[520, 0.07, 0, "square"]],
  gnatFire: [[145, 0.08, 0, "sawtooth"], [155, 0.08, 0.07, "sawtooth"], [138, 0.12, 0.14, "sawtooth"], [165, 0.1, 0.25, "sawtooth"]],
  destroy: [[660, 0.08, 0, "triangle"], [990, 0.12, 0.06, "triangle"]],
  hit: [[150, 0.2, 0, "sawtooth"]],
  levelUp: [[523, 0.12, 0, "triangle"], [659, 0.12, 0.1, "triangle"], [784, 0.2, 0.2, "triangle"]],
  roundAdvance: [[440, 0.1, 0, "sine"], [660, 0.16, 0.1, "sine"]],
  gameOver: [[392, 0.18, 0, "triangle"], [294, 0.22, 0.16, "triangle"], [196, 0.35, 0.34, "triangle"]],
  pause: [[440, 0.1, 0, "sine"]],
  resume: [[660, 0.12, 0, "sine"]],
  split: [[740, 0.08, 0, "square"], [520, 0.1, 0.06, "square"]],
  restart: [[523, 0.1, 0, "sine"], [784, 0.14, 0.1, "sine"]],
};

const EVENT_ALIASES = {
  shot: "shoot",
  obstacleDestroyed: "destroy",
  obstacleDestroyedByShot: "destroy",
  obstacleHit: "hit",
  damage: "hit",
  collision: "hit",
  levelup: "levelUp",
  level: "levelUp",
  round: "roundAdvance",
  gameover: "gameOver",
  paused: "pause",
  resumed: "resume",
  obstacleSplit: "split",
};

export function playGameSound(audioContext, event) {
  if (!audioContext || audioContext.state !== "running") return;

  const eventType = typeof event === "string" ? event : event?.type;
  if (!eventType) return;

  const normalizedType = eventType.replace(/[-_\s]/g, "");
  const volume = normalizedType === "shoot" || normalizedType === "shot" ? 0.021 : 0.06;
  const pattern = SOUND_PATTERNS[eventType] ||
    SOUND_PATTERNS[EVENT_ALIASES[normalizedType]] ||
    [[420, 0.1, 0, "sine"]];

  for (const [frequency, duration, delay, waveform] of pattern) {
    const start = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + duration);
  }
}
