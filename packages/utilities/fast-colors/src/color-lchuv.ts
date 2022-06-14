import { clamp, reduceAngleDegrees, roundToPrecisionSmall } from "./math-utilities.js";
/**
 *
 * {@link https://en.wikipedia.org/wiki/CIELUV | CIELCHUV color space}
 *
 * Uses the LCHuv color space which is a cylindrical representation of the LUV color space.
 * VERY IMPORTANT: While the L value is the same as for {@link ColorLCH}, u and v differ.
 * The LCH color space is derived from LAB in the same way LCHUV is derived from LUV
 * @public
 */
export class ColorLCHUV {
    public constructor(l: number, c: number, h: number) {
        this.l = l;
        this.c = c;
        this.h = h;
    }

    /**
     * Construct a {@link ColorLCHUV} from a config object.
     * @param data - the config object
     */
    public static fromObject(data: {
        l: number;
        c: number;
        h: number;
    }): ColorLCHUV | null {
        if (data && !isNaN(data.l) && !isNaN(data.c) && !isNaN(data.h)) {
            return new ColorLCHUV(data.l, data.c, data.h);
        }
        return null;
    }

    public readonly l: number;
    public readonly c: number;
    public readonly h: number;

    /**
     * Determines if one color is equal to another.
     * @param rhs - the color to compare
     */
    public equalValue(rhs: ColorLCHUV): boolean {
        return this.l === rhs.l && this.c === rhs.c && this.h === rhs.h;
    }

    /**
     * Returns a new {@link ColorLCHUV} rounded to the provided precision
     * @param precision - the precision to round to
     */
    public roundToPrecision(precision: number): ColorLCHUV {
        return new ColorLCHUV(
            roundToPrecisionSmall(this.l, precision),
            roundToPrecisionSmall(this.c, precision),
            roundToPrecisionSmall(this.h, precision)
        );
    }

    /**
     * Returns a new {@link ColorLCHUV} with values clamped to the range [0,10],[0,100],[0,360)
     */
    public clamp(): ColorLCHUV {
        return new ColorLCHUV(
            clamp(this.l, 0, 100),
            clamp(this.c, 0, 100),
            reduceAngleDegrees(this.h)
        );
    }

    /**
     * Converts the {@link ColorLCHUV} to a config object.
     */
    public toObject(): { l: number; c: number; h: number } {
        return { l: this.l, c: this.c, h: this.h };
    }
}
