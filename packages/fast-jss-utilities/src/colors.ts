import { contrast, ensureContrast } from "@microsoft/fast-colors";
import { memoize } from "lodash-es";

/**
 * Hashing function for contrast memoization
 */
function resolveContrastArgs(...args: (string | number) []): string {
    return args.join("");
}

const memoizedContrast = memoize(contrast, resolveContrastArgs);
const memoizedEnsureContrast = memoize(ensureContrast, resolveContrastArgs)

/**
 * Export memoized contrast functions to prevent calculating the same color
 * multiple times
 */
export { memoizedContrast as contrast };
export { memoizedEnsureContrast as ensureContrast };

/**
 * Target WCAG 2.0 contrast ratios defined here: https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html
 */
export enum ContrastRatios {
    /**
     * Contrast ratio between text and the background behind the text
     */
    text = 4.5
}
