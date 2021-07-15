/**
 * Coordinates for a cubic bezier curve.
 * @public
 */
export declare type BezierCurvePoint = [number, number];
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
export declare function formatCubicBezier(points: BezierCurve): string;
/**
 * Get a cubic bezier curve, formatted as a string, by name.
 * @param name - the name of the bezier curve to use.
 *
 * @public
 */
export declare function cubicBezier(
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
): string;
