/**
 * An interface for storing the relative luminance value of a color to aid in contrast calculations.
 *
 * @public
 */
export interface RelativeLuminance {
    /**
     * A number between 0 and 1, calculated by {@link https://www.w3.org/WAI/GL/wiki/Relative_luminance}
     */
    readonly relativeLuminance: number;
}

/**
 * Gets the contrast ratio between two colors expressed as relative luminance values.
 *
 * For example, the contrast between #FFFFFF and #767676 is 4.5:1
 *
 * @param a - One color relative luminance, for example, 1 for white
 * @param b - Another color relative luminance, for example, 0.18116 for #767676
 * @returns The contrast between the two luminance values, for example, 4.54
 *
 * @public
 */
export function contrast(a: RelativeLuminance, b: RelativeLuminance): number {
    const y1 = a.relativeLuminance > b.relativeLuminance ? a : b;
    const y2 = a.relativeLuminance > b.relativeLuminance ? b : a;

    return (y1.relativeLuminance + 0.05) / (y2.relativeLuminance + 0.05);
}
