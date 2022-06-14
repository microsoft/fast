import { roundToPrecisionSmall } from "./math-utilities.js";
import { ColorXYZ } from "./color-xyz.js";

/**
 * {@link https://en.wikipedia.org/wiki/CIELUV | CIELUV color space}
 * This implementation uses the D65 constants for 2 degrees. That determines the constants used for the pure white point of the XYZ space of 0.95047, 1.0, 1.08883.
 * {@link https://en.wikipedia.org/wiki/Illuminant_D65}
 * These constants determine how the XYZ, LCH, LAB, LUV and LCHUV colors convert to/from RGB.
 *
 * @public
 */
export class ColorLUV {
    public constructor(l: number, u: number, v: number) {
        this.l = l;
        this.u = u;
        this.v = v;
    }

    /**
     * Constants based on the XYZ white point used in conversions to and from LUV
     */
    public static readonly uPrimeR: number =
        (4 * ColorXYZ.whitePoint.x) /
        (ColorXYZ.whitePoint.x + 15 * ColorXYZ.whitePoint.y + 3 * ColorXYZ.whitePoint.z);
    public static readonly vPrimeR: number =
        (9 * ColorXYZ.whitePoint.y) /
        (ColorXYZ.whitePoint.x + 15 * ColorXYZ.whitePoint.y + 3 * ColorXYZ.whitePoint.z);

    /**
     * Construct a {@link ColorLUV} from a config object.
     */
    public static fromObject(data: { l: number; u: number; v: number }): ColorLUV | null {
        if (data && !isNaN(data.l) && !isNaN(data.u) && !isNaN(data.v)) {
            return new ColorLUV(data.l, data.u, data.v);
        }
        return null;
    }

    public readonly l: number;
    public readonly u: number;
    public readonly v: number;

    /**
     * Determines if a color is equal to another
     * @param rhs - the value to compare
     */
    public equalValue(rhs: ColorLUV): boolean {
        return this.l === rhs.l && this.u === rhs.u && this.v === rhs.v;
    }

    /**
     * Returns a new {@link ColorLUV} rounded to the provided precision
     * @param precision - the precision to round to
     */
    public roundToPrecision(precision: number): ColorLUV {
        return new ColorLUV(
            roundToPrecisionSmall(this.l, precision),
            roundToPrecisionSmall(this.u, precision),
            roundToPrecisionSmall(this.v, precision)
        );
    }

    /**
     * Returns the {@link ColorLUV} formatted as an object.
     */
    public toObject(): { l: number; u: number; v: number } {
        return { l: this.l, u: this.u, v: this.v };
    }
}
