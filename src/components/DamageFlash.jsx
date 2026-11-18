import { useEffect, useRef, useState } from "react";

export default function DamageFlash({ hits }) {
  const previousHits = useRef(hits);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hits <= previousHits.current) {
      previousHits.current = hits;
      return undefined;
    }

    previousHits.current = hits;
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 140);
    return () => window.clearTimeout(timeout);
  }, [hits]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-30 bg-white transition-opacity duration-100 ${
        visible ? "opacity-80" : "opacity-0"
      }`}
    />
  );
}
