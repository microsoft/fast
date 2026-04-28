import type { ValuesOf } from "../utilities/index.js";

/**
 * The direction options for flipper.
 * @public
 */
export const FlipperDirection = {
    next: "next",
    previous: "previous",
} as const;

/**
 * The types for the flipper direction options.
 * @public
 */
export type FlipperDirection = ValuesOf<typeof FlipperDirection>;
