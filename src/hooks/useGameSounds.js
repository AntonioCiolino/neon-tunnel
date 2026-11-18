import { useCallback, useRef } from "react";

export default function useGameSounds() {
  const contextRef = useRef(null);

  const playNotes = useCallback((notes, waveform = "sine", volume = 0.12) => {
    try {
      const AudioContextClass =
        globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AudioContextClass) return;

      let context = contextRef.current;
      if (!context || context.state === "closed") {
        context = new AudioContextClass();
        contextRef.current = context;
      }

      const play = () => {
        if (context.state !== "running") return;

        for (const { frequency, duration, delay = 0, gain = 1 } of notes) {
          const oscillator = context.createOscillator();
          const envelope = context.createGain();
          const start = context.currentTime + delay;
          const end = start + duration;

          oscillator.type = waveform;
          oscillator.frequency.setValueAtTime(frequency, start);
          envelope.gain.setValueAtTime(0.0001, start);
          envelope.gain.exponentialRampToValueAtTime(
            Math.max(0.0001, volume * gain),
            start + Math.min(0.01, duration / 3),
          );
          envelope.gain.exponentialRampToValueAtTime(0.0001, end);
          oscillator.connect(envelope);
          envelope.connect(context.destination);
          oscillator.onended = () => {
            oscillator.disconnect();
            envelope.disconnect();
          };
          oscillator.start(start);
          oscillator.stop(end);
        }
      };

      if (context.state === "suspended") {
        context.resume().then(play).catch(() => {});
      } else {
        play();
      }
    } catch {
      // Audio is an enhancement; unsupported or unavailable audio should not interrupt gameplay.
    }
  }, []);

  const playShoot = useCallback(() => {
    playNotes([
      { frequency: 880, duration: 0.07 },
      { frequency: 440, duration: 0.09, delay: 0.025, gain: 0.55 },
    ], "square", 0.045);
  }, [playNotes]);

  const playStart = useCallback(() => {
    playNotes([
      { frequency: 440, duration: 0.12 },
      { frequency: 660, duration: 0.16, delay: 0.1 },
    ], "sine");
  }, [playNotes]);

  const playPause = useCallback(() => {
    playNotes([{ frequency: 330, duration: 0.16 }], "triangle");
  }, [playNotes]);

  const playResume = useCallback(() => {
    playNotes([{ frequency: 520, duration: 0.12 }], "triangle");
  }, [playNotes]);

  const playHit = useCallback(() => {
    playNotes([
      { frequency: 180, duration: 0.2 },
      { frequency: 110, duration: 0.24, delay: 0.04, gain: 0.8 },
    ], "sawtooth", 0.09);
  }, [playNotes]);

  const playLevelUp = useCallback(() => {
    playNotes([
      { frequency: 523, duration: 0.12 },
      { frequency: 659, duration: 0.12, delay: 0.1 },
      { frequency: 784, duration: 0.2, delay: 0.2 },
    ], "sine");
  }, [playNotes]);

  const playGameOver = useCallback(() => {
    playNotes([
      { frequency: 392, duration: 0.2 },
      { frequency: 311, duration: 0.24, delay: 0.18 },
      { frequency: 233, duration: 0.4, delay: 0.39 },
    ], "triangle", 0.14);
  }, [playNotes]);

  return {
    playShoot,
    playStart,
    playPause,
    playResume,
    playHit,
    playLevelUp,
    playGameOver,
  };
}
