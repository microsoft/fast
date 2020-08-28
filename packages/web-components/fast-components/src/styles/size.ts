/**
 * A formula to retrieve the control height.
 * Use this as the value of any CSS property that
 * accepts a pixel size.
 */
export const heightNumber =
    "(var(--base-height-multiplier) + var(--density)) * var(--design-unit)";


export const glyphSize = "((var(--base-height-multiplier) / 2) * var(--design-unit)) + ((var(--design-unit) * var(--density)) / 2)";