/**
 *
 * {@link https://en.wikipedia.org/wiki/CIELAB_color_space | CIELCH color space}
 *
 * This is a cylindrical representation of the CIELAB space useful for saturation operations
 * This uses Hue values in "degree" format. So expect a range of [0,360]. Some other implementations instead uses radians or a normalized Hue with range [0,1]. Be aware of this when checking values or using other libraries.
 * This implementation uses the D65 constants for 2 degrees. That determines the constants used for the pure white point of the XYZ space of 0.95047, 1.0, 1.08883.
 * {@link https://en.wikipedia.org/wiki/Illuminant_D65}
 * These constants determine how the XYZ, LCH and LAB colors convert to/from RGB.
 *
 * @public
 */
export declare class ColorLCH {
    /**
     * Construct a {@link ColorLCH} from a config object.
     * @param data - the config object
     */
    static fromObject(data: { l: number; c: number; h: number }): ColorLCH | null;
    constructor(l: number, c: number, h: number);
    readonly l: number;
    readonly c: number;
    readonly h: number;
    /**
     * Determines if one color is equal to another.
     * @param rhs - the color to compare
     */
    equalValue(rhs: ColorLCH): boolean;
    /**
     * Returns a new {@link ColorLCH} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision: number): ColorLCH;
    /**
     * Converts the {@link ColorLCH} to a config object.
     */
    toObject(): {
        l: number;
        c: number;
        h: number;
    };
}
