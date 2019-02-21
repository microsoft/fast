// tslint:disable:member-ordering
import { roundToPrecisionSmall } from "./mathUtils";

// CIELAB color space
// https://en.wikipedia.org/wiki/CIELAB_color_space
// This implementation uses the D65 constants for 2 degrees. That determines the constants used for the pure white point of the XYZ space of 0.95047, 1.0, 1.08883.
// https://en.wikipedia.org/wiki/Illuminant_D65
// These constants determine how the XYZ, LCH and LAB colors convert to/from RGB.
export class ColorLAB {
    public static readonly epsilon: number = 216 / 24389;
    public static readonly kappa: number = 24389 / 27;

    public static fromObject(data: any): ColorLAB | null {
        if (data && !isNaN(data.l) && !isNaN(data.a) && !isNaN(data.b)) {
            return new ColorLAB(data.l, data.a, data.b);
        }
        return null;
    }

    constructor(l: number, a: number, b: number) {
        this.l = l;
        this.a = a;
        this.b = b;
    }

    public readonly l: number;
    public readonly a: number;
    public readonly b: number;

    public equalValue(rhs: ColorLAB): boolean {
        return this.l === rhs.l && this.a === rhs.a && this.b === rhs.b;
    }

    public roundToPrecision(precision: number): ColorLAB {
        return new ColorLAB(
            roundToPrecisionSmall(this.l, precision),
            roundToPrecisionSmall(this.a, precision),
            roundToPrecisionSmall(this.b, precision)
        );
    }

    public toObject(): object {
        return { l: this.l, a: this.a, b: this.b };
    }
}
