// import {
//     adjustContrast,
//     contrast,
//     ContrastFunction,
//     ensureContrast,
// } from "@microsoft/fast-colors";
// import { clamp, memoize } from "lodash-es";

// /**
//  * Hashing function for contrast memoization
//  */
// export function contrastHasher(...args: Array<string | number>): string {
//     return args
//         .map((value: string | number) => {
//             return typeof value === "string" ? value.toLowerCase() : value;
//         })
//         .join("");
// }

// const memoizedContrast: ContrastFunction = memoize(contrast, contrastHasher);
// const memoizedEnsureContrast: ContrastFunction = memoize(ensureContrast, contrastHasher);
// const memoizedAdjustContrast: ContrastFunction = memoize(adjustContrast, contrastHasher);

// /**
//  * Export memoized contrast functions to prevent calculating the same color
//  * multiple times
//  */
// export { memoizedContrast as contrast };
// export { memoizedEnsureContrast as ensureContrast };
// export { memoizedAdjustContrast as adjustContrast };

// /**
//  * Contrast ratios for normal and large UI elements and text.
//  * See https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html
//  * for more information
//  */
// export enum WCAGElementContrastRatios {
//     /**
//      * The contrast ratio for normal size text elements and UI elements less than 3px
//      */
//     normal = 4.5,

//     /**
//      * The contrast ratio for large size text elements and UI elements 3px or greater
//      */
//     large = 3,
// }

// /**
//  * Scales a contrast ratio (baseRatio) up by a scaleFactor (a number between 0 and 100) to achieve
//  * a new contrast ratio. When scaleFactor is 0, the baseRatio is returned. When scaleFactor is 100,
//  * 21 is returned. Otherwise, a number between baseRatio and 21 will be returned.
//  */
// export function scaleContrast(baseRatio: number, scaleFactor: number): number {
//     baseRatio = clamp(baseRatio || 0, 0, 21);

//     return (21 - baseRatio) / (100 / clamp(scaleFactor || 0, 0, 100)) + baseRatio;
// }
