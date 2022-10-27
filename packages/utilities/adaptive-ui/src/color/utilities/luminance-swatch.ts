import { Swatch, SwatchRGB } from "../swatch.js";

/**
 * Create a grey {@link Swatch} for the specified `luminance`. Note this is absolute luminance not 'relative' luminance.
 *
 * @param luminance - A value between 0 and 1 representing the desired luminance, for example, 0.5 for middle grey, 0 = black, 1 = white
 * @returns A swatch for the specified grey value
 *
 * @public
 */
export function luminanceSwatch(luminance: number): Swatch {
    return new SwatchRGB(luminance, luminance, luminance);
}
