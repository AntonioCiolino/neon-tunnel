import { useCallback, useEffect, useRef, useState } from "react";

export default function useAmbientAudio() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef(null);

  const disable = useCallback(() => {
    const audio = audioRef.current;
    audioRef.current = null;
    setEnabled(false);

    if (!audio) return;

    audio.sources.forEach((source) => {
      try {
        source.stop();
      } catch {
        // The source may already be stopped.
      }
    });
    audio.context.close();
  }, []);

  const enable = useCallback(() => {
    if (audioRef.current) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = 0.035;
    master.connect(context.destination);

    const noiseBuffer = context.createBuffer(
      1,
      context.sampleRate * 2,
      context.sampleRate,
    );
    const samples = noiseBuffer.getChannelData(0);
    for (let i = 0; i < samples.length; i += 1) {
      samples[i] = Math.random() * 2 - 1;
    }

    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;

    const noiseGain = context.createGain();
    noiseGain.gain.value = 0.35;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(master);

    const sources = [noise];
    noise.start();

    [55, 82.4].forEach((frequency) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.12;
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start();
      sources.push(oscillator);
    });

    audioRef.current = { context, sources };
    context.resume();
    setEnabled(true);
  }, []);

  useEffect(() => () => {
    const audio = audioRef.current;
    audioRef.current = null;

    if (!audio) return;

    audio.sources.forEach((source) => {
      try {
        source.stop();
      } catch {
        // The source may already be stopped.
      }
    });
    audio.context.close();
  }, []);

  return { enabled, enable, disable };
}
