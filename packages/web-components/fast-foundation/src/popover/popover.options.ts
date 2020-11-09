/**
 * Enumerates possible popover positions
 *
 * @public
 */
export enum PopoverPosition {
    /**
     * The popover positions above the element
     */
    top = "top",
    topLeft = "top-left-corner",
    topRight = "top-right-corner",
    topLeftAligned = "top-left-aligned",
    topRightAligned = "top-right-aligned",

    /**
     * The popover positions to the right of the element
     */
    right = "right",
    rightTopAligned = "right-top-aligned",
    rightBottomAligned = "right-bottom-aligned",

    /**
     * The popover positions below the element
     */
    bottom = "bottom",
    bottomLeft = "bottom-left-corner",
    bottomRight = "bottom-right-corner",
    bottomLeftAligned = "bottom-left-aligned",
    bottomRightAligned = "bottom-right-aligned",

    /**
     * The popover positions to the left of the element
     */
    left = "left",
    leftTopAligned = "left-top-aligned",
    leftBottomAligned = "left-bottom-aligned",
}
