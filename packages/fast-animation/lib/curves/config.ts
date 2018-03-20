import { IBezierCurve } from "./index";

export const linear: IBezierCurve = [
    [0, 0],
    [1, 1]
];
export const easeOut: IBezierCurve = [
    [0, 0],
    [0.58, 1]
];
export const easeOutSmooth: IBezierCurve = [
    [0, 0.35],
    [0.15, 1]
];
export const easeIn: IBezierCurve = [
    [0.25, 0.1],
    [0.25, 1]
];
export const drillIn: IBezierCurve = [
    [0.17, 0.17],
    [0, 1]
];
export const backToApp: IBezierCurve = [
    [0.5, 0],
    [0.6, 1]
];
export const appToApp: IBezierCurve = [
    [0.5, 0],
    [1, 0.9]
];
export const fastIn: IBezierCurve = [
    [0.1, 0.9],
    [0.2, 1]
];
export const fastOut: IBezierCurve = [
    [0.9, 0.1],
    [1, 0.2]
];
export const fastInOut: IBezierCurve = [
    [0.8, 0],
    [0.2, 1]
];
export const exponential: IBezierCurve = [
    [0.1, 0.25],
    [0.75, 0.9]
];
export const fastInFortySevenPercent: IBezierCurve = [
    [0.11, 0.5],
    [0.24, 0.96]
];
export const exponentialReversed: IBezierCurve = [
    [0.25, 0.1],
    [0.9, 0.75]
];
export const navPane: IBezierCurve = [
    [0.1, 0.7],
    [0.1, 1]
];
