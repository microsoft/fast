/**
 * This uses Hue values in "degree" format. So expect a range of [0,360]. Some other implementations instead uses radians or a normalized Hue with range [0,1]. Be aware of this when checking values or using other libraries.
 *
 * @public
 */
export declare class ColorHSL {
    /**
     * Construct a {@link ColorHSL} from a config object.
     */
    static fromObject(data: { h: number; s: number; l: number }): ColorHSL | null;
    constructor(hue: number, sat: number, lum: number);
    readonly h: number;
    readonly s: number;
    readonly l: number;
    /**
     * Determines if a color is equal to another
     * @param rhs - the value to compare
     */
    equalValue(rhs: ColorHSL): boolean;
    /**
     * Returns a new {@link ColorHSL} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision: number): ColorHSL;
    /**
     * Returns the {@link ColorHSL} formatted as an object.
     */
    toObject(): {
        h: number;
        s: number;
        l: number;
    };
}
