export function getPinchDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    tolerance: number
): number {
    const distance: number = Math.hypot(x2 - x1, y2 - y1);
    return distance > tolerance ? distance : 0;
}
