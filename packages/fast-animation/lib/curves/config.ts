import { BezierCurve } from './';

export const linear: BezierCurve = [
    [0, 0],
    [1, 1]
];
export const easeOut: BezierCurve = [
    [0, 0],
    [0.58, 1]
];
export const easeOutSmooth: BezierCurve = [
    [0, 0.35],
    [0.15, 1]
];
export const easeIn: BezierCurve = [
    [0.25, 0.1],
    [0.25, 1]
];
export const drillIn: BezierCurve = [
    [0.17, 0.17],
    [0, 1] 
];
export const backToApp: BezierCurve = [
    [0.5, 0],
    [0.6, 1]
];
export const appToApp: BezierCurve = [
    [0.5, 0],
    [1, 0.9] 
];
export const fastIn: BezierCurve = [
    [0.1, 0.9],
    [0.2, 1] 
];
export const fastOut: BezierCurve = [
    [0.9, 0.1],
    [1, 0.2]
];
export const fastInOut: BezierCurve = [
    [0.8, 0],
    [0.2, 1]
];
export const exponential: BezierCurve = [
    [0.1, 0.25],
    [0.75, 0.9]
];
export const fastInFortySevenPercent: BezierCurve = [
    [0.11, 0.5],
    [0.24, 0.96]
];
export const exponentialReversed: BezierCurve = [
    [0.25, 0.1],
    [0.9, 0.75]
];
export const navPane: BezierCurve = [
    [0.1, 0.7],
    [0.1, 1]
];
