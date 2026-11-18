import { useEffect, useRef, useState } from "react";

export default function DamageFlash({ hits, enemyHits = 0 }) {
  const previousHits = useRef(hits);
  const previousEnemyHits = useRef(enemyHits);
  const [visible, setVisible] = useState(false);
  const [intense, setIntense] = useState(false);

  useEffect(() => {
    const lifeHit = hits > previousHits.current;
    const enemyHit = enemyHits > previousEnemyHits.current;
    previousHits.current = hits;
    previousEnemyHits.current = enemyHits;
    if (!lifeHit && !enemyHit) return undefined;

    setIntense(enemyHit);
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 140);
    return () => window.clearTimeout(timeout);
  }, [hits, enemyHits]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-30 bg-white transition-opacity duration-100 ${
        visible ? (intense ? "opacity-100" : "opacity-80") : "opacity-0"
      }`}
    />
  );
}
