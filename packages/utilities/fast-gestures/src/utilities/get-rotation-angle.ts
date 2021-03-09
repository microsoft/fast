export function getRotationAngle(x1: number, y1: number, x2: number, y2: number): number {
  const angle: number = (Math.atan2(y1 - y2, x1 - x2) * 180) / Math.PI + 180;
  return angle;
}