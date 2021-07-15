import * as bezierCurves from "./config";
/**
 * Formats a cubic bezier config into a cubic bezier string
 *
 * @public
 */
export function formatCubicBezier(points) {
    if (
        !Array.isArray(points) ||
        !Array.isArray(points[0]) ||
        !Array.isArray(points[1])
    ) {
        return "";
    }
    const p0 = points[0];
    const p1 = points[1];
    return `cubic-bezier(${p0[0]}, ${p0[1]}, ${p1[0]}, ${p1[1]})`;
}
/**
 * Get a cubic bezier curve, formatted as a string, by name.
 * @param name - the name of the bezier curve to use.
 *
 * @public
 */
export function cubicBezier(name) {
    return bezierCurves.hasOwnProperty(name) ? formatCubicBezier(bezierCurves[name]) : "";
}
