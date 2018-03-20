import * as bezierCurves from "./config";

export type BezierCurvePoint = [number, number];
/**
 * Defines interface for a cubic bezier curve
 */
export interface IBezierCurve {
    /**
     * Control point 1 (P0)
     */
    0: BezierCurvePoint;

    /**
     * Control point 2 (P1)
     */
    1: BezierCurvePoint;
}

export function cubicBezier(name: string): string {
    return bezierCurves.hasOwnProperty(name) ? formatCubicBezier(bezierCurves[name]) : "";
}

/**
 * Formats a cubic bezier config into a cubic bezier string
 */
export function formatCubicBezier(points: IBezierCurve): string {
    if (!Array.isArray(points) || !Array.isArray(points[0]) || !Array.isArray(points[1])) {
        return "";
    }

    const p0: BezierCurvePoint = points[0];
    const p1: BezierCurvePoint = points[1];

    return `cubic-bezier(${p0[0]}, ${p0[1]}, ${p1[0]}, ${p1[1]})`;
}
