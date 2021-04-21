import { Swatch } from "../swatch";

/*
 * A color is in dark mode if there is more contrast between #000000 and a background
 * color than #FFFFFF and a background color. That threshold can be expressed as a relative luminance
 * using the contrast formula as (1 + 0.5) / (bg + 0.05) === (bg + 0.05) / (0 + 0.05),
 * which reduces to the following, where bg is the relative luminance of the background color
 */
const target = (-0.1 + Math.sqrt(0.21)) / 2;

/**
 * Determines if a color should be considered Dark Mode
 * @param color - The color to check to mode of
 * @returns boolean
 *
 * @internal
 */
export function isDarkMode(color: Swatch): boolean {
    return color.relativeLuminance <= target;
}
