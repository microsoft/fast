/**
 * vertical positioning values for an anchored region
 * @beta
 */
export const MenuPlacement = {
    bottom: "bottom",
    bottomFill: "bottom-fill",
    tallest: "tallest",
    tallestFill: "tallest-fill",
    top: "top",
    topFill: "top-fill",
} as const;

/**
 * Type for vertical positioning values for an anchored region
 * @beta
 */
export type MenuPlacement = typeof MenuPlacement[keyof typeof MenuPlacement];
