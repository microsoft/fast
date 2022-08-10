import { PaletteDirectionValue } from "../palette.js";
import { isDark } from "./is-dark.js";
import { RelativeLuminance } from "./relative-luminance.js";

/**
 * Gets an inverse directional multiplier based on whether the `color` is dark or light.
 *
 * @param color - The color to check
 * @returns `darker` if the `color` is light, `lighter` if the `color` is dark
 *
 * @public
 */
export function directionByIsDark(color: RelativeLuminance): PaletteDirectionValue {
    return isDark(color) ? PaletteDirectionValue.lighter : PaletteDirectionValue.darker;
}
