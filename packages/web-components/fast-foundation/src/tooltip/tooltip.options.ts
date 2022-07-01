/**
 * Enumerates possible tooltip positions
 *
 * @public
 */
export const TooltipPosition = {
    /**
     * The tooltip is positioned above the element
     */
    top: "top",

    /**
     * The tooltip is positioned above the element and and in the logical start position
     */
    topStart: "top-start",

    /**
     * The tooltip is positioned above the element and in the logical end position
     */
    topEnd: "top-end",

    /**
     * The tooltip is positioned to the right of the element
     */
    right: "right",

    /**
     * The tooltip is positioned to the right the element and in the logical start position
     */
    rightStart: "right-start",

    /**
     * The tooltip is positioned to the right of the element and in the logical end position
     */
    rightEnd: "right-end",

    /**
     * The tooltip is positioned below the element
     */
    bottom: "bottom",

    /**
     * The tooltip is positioned below the element and and in the logical start position
     */
    bottomStart: "bottom-start",

    /**
     * The tooltip is positioned below the element and in the logical end position
     */
    bottomEnd: "bottom-end",

    /**
     * The tooltip is positioned to the left of the element
     */
    left: "left",

    /**
     * The tooltip is positioned to the left the element and in the logical start position
     */
    leftStart: "left-start",

    /**
     * The tooltip is positioned to the left of the element and in the logical end position
     */
    leftEnd: "left-end",
} as const;

/**
 * The possible tooltip positions
 *
 * @public
 */
export type TooltipPosition = typeof TooltipPosition[keyof typeof TooltipPosition];
