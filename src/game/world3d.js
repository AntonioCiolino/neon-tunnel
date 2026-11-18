export const DEFAULT_CAMERA_FOV = Math.PI / 2;
export const CAMERA_NEAR = 0.1;

export function createCamera({ x = 0, y = 0, z = 0, fov = DEFAULT_CAMERA_FOV } = {}) {
  return { x, y, z, fov };
}

export function distance3D(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

export function projectWorldPoint(point, camera, width, height) {
  if (!point || width <= 0 || height <= 0) return null;

  const depth = point.z - (camera?.z ?? 0);
  if (depth <= CAMERA_NEAR) return null;

  const focalLength = Math.min(width, height) / (2 * Math.tan((camera?.fov ?? DEFAULT_CAMERA_FOV) / 2));
  const scale = focalLength / depth;

  return {
    x: width / 2 + (point.x - (camera?.x ?? 0)) * scale,
    y: height / 2 - (point.y - (camera?.y ?? 0)) * scale,
    scale,
  };
}
