/**
 * Resize mode for a TextArea
 * @public
 */
export var TextAreaResize;
(function (TextAreaResize) {
    /**
     * No resize.
     */
    TextAreaResize["none"] = "none";
    /**
     * Resize vertically and horizontally.
     */
    TextAreaResize["both"] = "both";
    /**
     * Resize horizontally.
     */
    TextAreaResize["horizontal"] = "horizontal";
    /**
     * Resize vertically.
     */
    TextAreaResize["vertical"] = "vertical";
})(TextAreaResize || (TextAreaResize = {}));
