import { contrast, ContrastFunction, ensureContrast } from "@microsoft/fast-colors";
import { clamp, memoize } from "lodash-es";

/**
 * Hashing function for contrast memoization
 */
function resolveContrastArgs(...args: Array<string | number>): string {
    return args.join("");
}

const memoizedContrast: ContrastFunction = memoize(contrast, resolveContrastArgs);
const memoizedEnsureContrast: ContrastFunction = memoize(ensureContrast, resolveContrastArgs);

/**
 * Export memoized contrast functions to prevent calculating the same color
 * multiple times
 */
export { memoizedContrast as contrast };
export { memoizedEnsureContrast as ensureContrast };

/**
 * Contrast ratios for normal and large UI elements and text.
 * See https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html
 * for more information
 */
export enum WCAGAAContrastRatios {
    /**
     * The contrast ratio for normal size text elements and UI elements less than 3px
     */
    normal = 4.5,

    /**
     * The contrast ratio for large size text elements and UI elements 3px or greater
     */
    large = 3
}

/**
 * Scales a baseRatio up by a scaleFactor (a number between 0 and 100) to achieve a new contrast ratio.
 * When scaleFactor is 0, the baseRatio is returned. When scaleFactor is 100, 21 is returned.
 * Otherwise, a number between baseRatio and 21 will be returned.
 */
export function scaleContrast(baseRatio: number = 0, scaleFactor: number = 0): number {
    baseRatio = clamp(baseRatio, 0, 21);

    return (21 - baseRatio) / (100 / clamp(scaleFactor, 0, 100)) + baseRatio;
}
