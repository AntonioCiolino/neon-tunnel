export default function TunnelCanvas({ canvasRef, onShoot }) {
  // useTunnelGame's shoot takes client coordinates and measures the canvas itself.
  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    onShoot?.(event.clientX, event.clientY);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block h-full w-full touch-none"
      onPointerDown={handlePointerDown}
      aria-label="Tunnel shooter game"
    >
      Your browser does not support the game canvas.
    </canvas>
  );
}
