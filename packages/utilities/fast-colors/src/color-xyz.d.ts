/**
 * {@link https://en.wikipedia.org/wiki/CIE_1931_color_space | XYZ color space}
 *
 * This implementation uses the D65 constants for 2 degrees. That determines the constants used for the pure white point of the XYZ space of 0.95047, 1.0, 1.08883.
 * {@link https://en.wikipedia.org/wiki/Illuminant_D65}
 * These constants determine how the XYZ, LCH and LAB colors convert to/from RGB.
 *
 * @public
 */
export declare class ColorXYZ {
    /**
     * D65 2 degree white point
     */
    static readonly whitePoint: ColorXYZ;
    /**
     * Construct a {@link ColorXYZ} from a config object.
     */
    static fromObject(data: { x: number; y: number; z: number }): ColorXYZ | null;
    constructor(x: number, y: number, z: number);
    readonly x: number;
    readonly y: number;
    readonly z: number;
    /**
     * Determines if a color is equal to another
     * @param rhs - the value to compare
     */
    equalValue(rhs: ColorXYZ): boolean;
    /**
     * Returns a new {@link ColorXYZ} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision: number): ColorXYZ;
    /**
     * Returns the {@link ColorXYZ} formatted as an object.
     */
    toObject(): {
        x: number;
        y: number;
        z: number;
    };
}
