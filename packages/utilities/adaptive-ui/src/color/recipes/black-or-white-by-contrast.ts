import { Swatch } from "../swatch.js";
import { _black, _white } from "../utilities/color-constants.js";

/**
 * Gets a black or white Swatch based on the reference color and minimum contrast.
 *
 * @param reference - The reference color
 * @param minContrast - The minimum contrast required for black or white from `reference`
 * @param defaultBlack - True to default to black if both black and white meet contrast
 * @returns A black or white Swatch
 *
 * @public
 */
export function blackOrWhiteByContrast(
    reference: Swatch,
    minContrast: number,
    defaultBlack: boolean
): Swatch {
    const defaultColor = defaultBlack ? _black : _white;
    const otherColor = defaultBlack ? _white : _black;
    return reference.contrast(defaultColor) >= minContrast ? defaultColor : otherColor;
}
