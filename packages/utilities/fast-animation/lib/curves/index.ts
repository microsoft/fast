import * as bezierCurves from "./config";
/**
 * Coordinates for a cubic bezier curve.
 * @public
 */
export type BezierCurvePoint = [number, number];
/**
 * Defines interface for a cubic bezier curve
 * @public
 */
export interface BezierCurve {
    /**
     * Control point 1 (P0)
     */
    0: BezierCurvePoint;

    /**
     * Control point 2 (P1)
     */
    1: BezierCurvePoint;
}

/**
 * Formats a cubic bezier config into a cubic bezier string
 *
 * @public
 */
export function formatCubicBezier(points: BezierCurve): string {
    if (
        !Array.isArray(points) ||
        !Array.isArray(points[0]) ||
        !Array.isArray(points[1])
    ) {
        return "";
    }

    const p0: BezierCurvePoint = points[0];
    const p1: BezierCurvePoint = points[1];

    return `cubic-bezier(${p0[0]}, ${p0[1]}, ${p1[0]}, ${p1[1]})`;
}

/**
 * Get a cubic bezier curve, formatted as a string, by name.
 * @param name - the name of the bezier curve to use.
 *
 * @public
 */
export function cubicBezier(
    name:
        | "linear"
        | "easeOut"
        | "easeOutSmooth"
        | "easeIn"
        | "drillIn"
        | "backToApp"
        | "appToApp"
        | "fastIn"
        | "fastOut"
        | "fastInOut"
        | "exponential"
        | "fastInFortySevenPercent"
        | "exponentialReversed"
        | "navPane"
        | /* @deprecated */ string
): string {
    return bezierCurves.hasOwnProperty(name) ? formatCubicBezier(bezierCurves[name]) : "";
}
