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
export type FlipperDirection = typeof FlipperDirection[keyof typeof FlipperDirection];
