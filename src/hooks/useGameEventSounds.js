import { useCallback, useEffect, useRef } from "react";
import { playGameSound } from "../game/gameSounds";

export default function useGameEventSounds() {
  const audioContextRef = useRef(null);

  const unlockAudio = useCallback(() => {
    const AudioContextClass =
      globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextClass) return;

    let audioContext = audioContextRef.current;
    if (!audioContext || audioContext.state === "closed") {
      audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
  }, []);

  const playEvent = useCallback((event) => {
    let audioContext = audioContextRef.current;
    if (!audioContext) {
      unlockAudio();
      audioContext = audioContextRef.current;
    }
    if (!audioContext) return;

    if (audioContext.state === "running") {
      playGameSound(audioContext, event);
      return;
    }

    audioContext.resume()
      .then(() => playGameSound(audioContext, event))
      .catch(() => {});
  }, [unlockAudio]);

  useEffect(() => {
    window.addEventListener("pointerdown", unlockAudio, true);
    window.addEventListener("keydown", unlockAudio, true);

    return () => {
      window.removeEventListener("pointerdown", unlockAudio, true);
      window.removeEventListener("keydown", unlockAudio, true);
      const audioContext = audioContextRef.current;
      audioContextRef.current = null;
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close().catch(() => {});
      }
    };
  }, [unlockAudio]);

  return { playEvent, unlockAudio };
}
