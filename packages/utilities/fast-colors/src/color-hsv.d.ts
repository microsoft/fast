/**
 * This uses Hue values in "degree" format. So expect a range of [0,360]. Some other implementations instead uses radians or a normalized Hue with range [0,1]. Be aware of this when checking values or using other libraries.
 *
 * @public
 */
export declare class ColorHSV {
    /**
     * Construct a {@link ColorHSV} from a config object.
     */
    static fromObject(data: { h: number; s: number; v: number }): ColorHSV | null;
    constructor(hue: number, sat: number, val: number);
    readonly h: number;
    readonly s: number;
    readonly v: number;
    /**
     * Determines if a color is equal to another
     * @param rhs - the value to compare
     */
    equalValue(rhs: ColorHSV): boolean;
    /**
     * Returns a new {@link ColorHSV} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision: number): ColorHSV;
    /**
     * Returns the {@link ColorHSV} formatted as an object.
     */
    toObject(): {
        h: number;
        s: number;
        v: number;
    };
}
