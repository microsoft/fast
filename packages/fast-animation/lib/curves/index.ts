import * as bezierCurves from './config';

/**
 * Defines interface for a cubic bezier curve
 */
export interface BezierCurve {
    /**
     * Control point 1 (P0)
     */
    0: [number, number];

    /**
     * Control point 2 (P1)
     */
    1: [number, number];
}

export function cubicBezier(name: string): string {
    return bezierCurves.hasOwnProperty(name) ? formatCubicBezier(bezierCurves[name]) : '';
}

/**
 * Formats a cubic bezier config into a cubic bezier string
 */
export function formatCubicBezier(points) {
    if (!Array.isArray(points) || !Array.isArray(points[0]) || !Array.isArray(points[1])) {
        return '';
    }

    const p0 = points[0];
    const p1 = points[1];
    
    return `cubic-bezier(${p0[0]}, ${p0[1]}, ${p1[0]}, ${p1[1]})`;
}
