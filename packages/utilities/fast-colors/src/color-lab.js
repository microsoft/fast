import { roundToPrecisionSmall } from "./math-utilities";
/**
 * {@link https://en.wikipedia.org/wiki/CIELAB_color_space | CIELAB color space}
 * This implementation uses the D65 constants for 2 degrees. That determines the constants used for the pure white point of the XYZ space of 0.95047, 1.0, 1.08883.
 * {@link https://en.wikipedia.org/wiki/Illuminant_D65}
 * These constants determine how the XYZ, LCH and LAB colors convert to/from RGB.
 *
 * @public
 */
export class ColorLAB {
    constructor(l, a, b) {
        this.l = l;
        this.a = a;
        this.b = b;
    }
    /**
     * Construct a {@link ColorLAB} from a config object.
     */
    static fromObject(data) {
        if (data && !isNaN(data.l) && !isNaN(data.a) && !isNaN(data.b)) {
            return new ColorLAB(data.l, data.a, data.b);
        }
        return null;
    }
    /**
     * Determines if a color is equal to another
     * @param rhs - the value to compare
     */
    equalValue(rhs) {
        return this.l === rhs.l && this.a === rhs.a && this.b === rhs.b;
    }
    /**
     * Returns a new {@link ColorLAB} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision) {
        return new ColorLAB(
            roundToPrecisionSmall(this.l, precision),
            roundToPrecisionSmall(this.a, precision),
            roundToPrecisionSmall(this.b, precision)
        );
    }
    /**
     * Returns the {@link ColorLAB} formatted as an object.
     */
    toObject() {
        return { l: this.l, a: this.a, b: this.b };
    }
}
ColorLAB.epsilon = 216 / 24389;
ColorLAB.kappa = 24389 / 27;
