import { Swatch, SwatchRGB } from "../swatch.js";

/**
 * Create a grey swatch for the specified `luminance`. Note this is absolute luminance not 'relative' luminance.
 *
 * @param luminance - A value between 0 and 1 representing the desired luminance, for example, 0.5 for middle grey
 * @returns A swatch for the specified grey value
 *
 * @public
 */
export function luminanceSwatch(luminance: number): Swatch {
    return new SwatchRGB(luminance, luminance, luminance);
}
