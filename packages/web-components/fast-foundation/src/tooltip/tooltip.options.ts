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
     * The tooltip is positioned to the right of the element
     */
    right: "right",

    /**
     * The tooltip is positioned below the element
     */
    bottom: "bottom",

    /**
     * The tooltip is positioned to the left of the element
     */
    left: "left",

    /**
     * The tooltip is positioned in the center of the element
     */
    center: "center",

    /**
     * The tooltip is positioned before the element
     */
    start: "start",

    /**
     * The tooltip is positioned after the element
     */
    end: "end",

    /**
     * The tooltip is positioned above the element and to the left
     */
    topLeft: "top-left",

    /**
     * The tooltip is positioned above the element and horizontally centered
     */
    topCenter: "top-center",

    /**
     * The tooltip is positioned above the element and to the right
     */
    topRight: "top-right",

    /**
     * The tooltip is positioned below the element and to the left
     */
    bottomLeft: "bottom-left",

    /**
     * The tooltip is positioned below the element and horizontally centered
     */
    bottomCenter: "bottom-center",

    /**
     * The tooltip is positioned below the element and to the right
     */
    bottomRight: "bottom-right",

    /**
     * The tooltip is positioned above the element and to the left
     */
    topStart: "top-start",

    /**
     * The tooltip is positioned above the element and to the right
     */
    topEnd: "top-end",

    /**
     * The tooltip is positioned below the element and to the left
     */
    bottomStart: "bottom-start",

    /**
     * The tooltip is positioned below the element and to the right
     */
    bottomEnd: "bottom-end",
} as const;

/**
 * The possible tooltip positions
 *
 * @public
 */
export type TooltipPosition = typeof TooltipPosition[keyof typeof TooltipPosition];
