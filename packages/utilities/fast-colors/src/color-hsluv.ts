import { clamp, reduceAngleDegrees, roundToPrecisionSmall } from "./math-utilities.js";

/**
 * Uses the modified CIELUV color space described here https://www.hsluv.org/
 * This uses Hue values in "degree" format. So expect a range of [0,360]. Some other implementations instead uses radians or a normalized Hue with range [0,1]. Be aware of this when checking values or using other libraries.
 * The S and L values are in the range [0,100]
 *
 * @public
 */
export class ColorHSLUV {
    public constructor(hue: number, sat: number, lum: number) {
        this.h = hue;
        this.s = sat;
        this.l = lum;
    }

    // Constants used in the conversion to HSVLUV
    public static m: number[][] = [
        [3.240969941904521, -1.537383177570093, -0.498610760293],
        [-0.96924363628087, 1.87596750150772, 0.041555057407175],
        [0.055630079696993, -0.20397695888897, 1.056971514242878],
    ];

    /**
     * Construct a {@link ColorHSLUV} from a config object.
     */
    public static fromObject(data: {
        h: number;
        s: number;
        l: number;
    }): ColorHSLUV | null {
        if (data && !isNaN(data.h) && !isNaN(data.s) && !isNaN(data.l)) {
            return new ColorHSLUV(data.h, data.s, data.l);
        }
        return null;
    }

    public readonly h: number;
    public readonly s: number;
    public readonly l: number;

    /**
     * Determines if a color is equal to another
     * @param rhs - the value to compare
     */
    public equalValue(rhs: ColorHSLUV): boolean {
        return this.h === rhs.h && this.s === rhs.s && this.l === rhs.l;
    }

    /**
     * Returns a new {@link ColorHSLUV} rounded to the provided precision
     * @param precision - the precision to round to
     */
    public roundToPrecision(precision: number): ColorHSLUV {
        return new ColorHSLUV(
            roundToPrecisionSmall(this.h, precision),
            roundToPrecisionSmall(this.s, precision),
            roundToPrecisionSmall(this.l, precision)
        );
    }

    /**
     * Returns a new {@link ColorHSLUV} with values clamped to the range [0,360),[0,100],[0,100]
     */
    public clamp(): ColorHSLUV {
        return new ColorHSLUV(
            reduceAngleDegrees(this.h),
            clamp(this.s, 0, 100),
            clamp(this.l, 0, 100)
        );
    }

    /**
     * Returns the {@link ColorHSLUV} formatted as an object.
     */
    public toObject(): { h: number; s: number; l: number } {
        return { h: this.h, s: this.s, l: this.l };
    }
}
