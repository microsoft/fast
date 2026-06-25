import type { ValuesOf } from "../utilities/index.js";

/**
 * Enumerates possible tooltip placements.
 *
 * @public
 */
export const TooltipPlacement = {
    bottom: "bottom",
    bottomEnd: "bottom-end",
    bottomStart: "bottom-start",
    left: "left",
    leftEnd: "left-end",
    leftStart: "left-start",
    right: "right",
    rightEnd: "right-end",
    rightStart: "right-start",
    top: "top",
    topEnd: "top-end",
    topStart: "top-start",
} as const;

/**
 * The possible tooltip placements.
 *
 * @public
 */
export type TooltipPlacement = ValuesOf<typeof TooltipPlacement>;
