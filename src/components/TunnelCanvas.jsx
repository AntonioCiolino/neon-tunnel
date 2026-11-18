export default function TunnelCanvas({ canvasRef, onShoot }) {
  const handlePointerDown = (event) => {
    if (event.button !== 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    onShoot?.(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect.width,
      rect.height
    );
  };

  return (
    <canvas
      ref={canvasRef}
      className="block h-full min-h-[320px] w-full touch-none"
      onPointerDown={handlePointerDown}
      aria-label="Tunnel shooter game"
    >
      Your browser does not support the game canvas.
    </canvas>
  );
}
