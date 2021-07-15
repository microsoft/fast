import { roundToPrecisionSmall } from "./math-utilities";
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
export class ColorLCH {
    constructor(l, c, h) {
        this.l = l;
        this.c = c;
        this.h = h;
    }
    /**
     * Construct a {@link ColorLCH} from a config object.
     * @param data - the config object
     */
    static fromObject(data) {
        if (data && !isNaN(data.l) && !isNaN(data.c) && !isNaN(data.h)) {
            return new ColorLCH(data.l, data.c, data.h);
        }
        return null;
    }
    /**
     * Determines if one color is equal to another.
     * @param rhs - the color to compare
     */
    equalValue(rhs) {
        return this.l === rhs.l && this.c === rhs.c && this.h === rhs.h;
    }
    /**
     * Returns a new {@link ColorLCH} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision) {
        return new ColorLCH(
            roundToPrecisionSmall(this.l, precision),
            roundToPrecisionSmall(this.c, precision),
            roundToPrecisionSmall(this.h, precision)
        );
    }
    /**
     * Converts the {@link ColorLCH} to a config object.
     */
    toObject() {
        return { l: this.l, c: this.c, h: this.h };
    }
}
