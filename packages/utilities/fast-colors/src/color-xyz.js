import { roundToPrecisionSmall } from "./math-utilities";
/**
 * {@link https://en.wikipedia.org/wiki/CIE_1931_color_space | XYZ color space}
 *
 * This implementation uses the D65 constants for 2 degrees. That determines the constants used for the pure white point of the XYZ space of 0.95047, 1.0, 1.08883.
 * {@link https://en.wikipedia.org/wiki/Illuminant_D65}
 * These constants determine how the XYZ, LCH and LAB colors convert to/from RGB.
 *
 * @public
 */
export class ColorXYZ {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * Construct a {@link ColorXYZ} from a config object.
     */
    static fromObject(data) {
        if (data && !isNaN(data.x) && !isNaN(data.y) && !isNaN(data.z)) {
            return new ColorXYZ(data.x, data.y, data.z);
        }
        return null;
    }
    /**
     * Determines if a color is equal to another
     * @param rhs - the value to compare
     */
    equalValue(rhs) {
        return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z;
    }
    /**
     * Returns a new {@link ColorXYZ} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision) {
        return new ColorXYZ(
            roundToPrecisionSmall(this.x, precision),
            roundToPrecisionSmall(this.y, precision),
            roundToPrecisionSmall(this.z, precision)
        );
    }
    /**
     * Returns the {@link ColorXYZ} formatted as an object.
     */
    toObject() {
        return { x: this.x, y: this.y, z: this.z };
    }
}
/**
 * D65 2 degree white point
 */
ColorXYZ.whitePoint = new ColorXYZ(0.95047, 1.0, 1.08883);
