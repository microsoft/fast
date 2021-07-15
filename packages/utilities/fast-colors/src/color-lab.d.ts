/**
 * {@link https://en.wikipedia.org/wiki/CIELAB_color_space | CIELAB color space}
 * This implementation uses the D65 constants for 2 degrees. That determines the constants used for the pure white point of the XYZ space of 0.95047, 1.0, 1.08883.
 * {@link https://en.wikipedia.org/wiki/Illuminant_D65}
 * These constants determine how the XYZ, LCH and LAB colors convert to/from RGB.
 *
 * @public
 */
export declare class ColorLAB {
    static readonly epsilon: number;
    static readonly kappa: number;
    /**
     * Construct a {@link ColorLAB} from a config object.
     */
    static fromObject(data: { l: number; a: number; b: number }): ColorLAB | null;
    constructor(l: number, a: number, b: number);
    readonly l: number;
    readonly a: number;
    readonly b: number;
    /**
     * Determines if a color is equal to another
     * @param rhs - the value to compare
     */
    equalValue(rhs: ColorLAB): boolean;
    /**
     * Returns a new {@link ColorLAB} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision: number): ColorLAB;
    /**
     * Returns the {@link ColorLAB} formatted as an object.
     */
    toObject(): {
        l: number;
        a: number;
        b: number;
    };
}
