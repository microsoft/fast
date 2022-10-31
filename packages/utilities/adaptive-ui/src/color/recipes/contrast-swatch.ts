import { Palette, PaletteDirection } from "../palette.js";
import { Swatch } from "../swatch.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";

/**
 * Gets a Swatch meeting the minimum contrast from the reference color.
 *
 * @param palette - The Palette used to find the Swatch
 * @param reference - The reference color
 * @param minContrast - The desired minimum contrast
 * @param direction - The direction the delta moves on the `palette`, defaults to {@link directionByIsDark} based on `reference`
 * @returns The Swatch
 *
 * @public
 */
export function contrastSwatch(
    palette: Palette,
    reference: Swatch,
    minContrast: number,
    direction: PaletteDirection = directionByIsDark(reference)
): Swatch {
    return palette.colorContrast(reference, minContrast, undefined, direction);
}
