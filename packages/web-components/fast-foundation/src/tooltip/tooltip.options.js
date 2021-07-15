/**
 * Enumerates possible tooltip positions
 *
 * @public
 */
export var TooltipPosition;
(function (TooltipPosition) {
    /**
     * The tooltip is positioned above the element
     */
    TooltipPosition["top"] = "top";
    /**
     * The tooltip is positioned to the right of the element
     */
    TooltipPosition["right"] = "right";
    /**
     * The tooltip is positioned below the element
     */
    TooltipPosition["bottom"] = "bottom";
    /**
     * The tooltip is positioned to the left of the element
     */
    TooltipPosition["left"] = "left";
    /**
     * The tooltip is positioned before the element
     */
    TooltipPosition["start"] = "start";
    /**
     * The tooltip is positioned after the element
     */
    TooltipPosition["end"] = "end";
})(TooltipPosition || (TooltipPosition = {}));
