import { roundToPrecisionSmall } from "./math-utilities";
/**
 * This uses Hue values in "degree" format. So expect a range of [0,360]. Some other implementations instead uses radians or a normalized Hue with range [0,1]. Be aware of this when checking values or using other libraries.
 *
 * @public
 */
export class ColorHSV {
    constructor(hue, sat, val) {
        this.h = hue;
        this.s = sat;
        this.v = val;
    }
    /**
     * Construct a {@link ColorHSV} from a config object.
     */
    static fromObject(data) {
        if (data && !isNaN(data.h) && !isNaN(data.s) && !isNaN(data.v)) {
            return new ColorHSV(data.h, data.s, data.v);
        }
        return null;
    }
    /**
     * Determines if a color is equal to another
     * @param rhs - the value to compare
     */
    equalValue(rhs) {
        return this.h === rhs.h && this.s === rhs.s && this.v === rhs.v;
    }
    /**
     * Returns a new {@link ColorHSV} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision) {
        return new ColorHSV(
            roundToPrecisionSmall(this.h, precision),
            roundToPrecisionSmall(this.s, precision),
            roundToPrecisionSmall(this.v, precision)
        );
    }
    /**
     * Returns the {@link ColorHSV} formatted as an object.
     */
    toObject() {
        return { h: this.h, s: this.s, v: this.v };
    }
}
