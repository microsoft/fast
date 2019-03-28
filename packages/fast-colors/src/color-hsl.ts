// tslint:disable:member-ordering
import { roundToPrecisionSmall } from "./math-utilities";

// This uses Hue values in "degree" format. So expect a range of [0,360]. Some other implementations instead uses radians or a normalized Hue with range [0,1]. Be aware of this when checking values or using other libraries.
export class ColorHSL {
    public static fromObject(data: { h: number; s: number; l: number }): ColorHSL | null {
        if (data && !isNaN(data.h) && !isNaN(data.s) && !isNaN(data.l)) {
            return new ColorHSL(data.h, data.s, data.l);
        }
        return null;
    }

    constructor(hue: number, sat: number, lum: number) {
        this.h = hue;
        this.s = sat;
        this.l = lum;
    }

    public readonly h: number;
    public readonly s: number;
    public readonly l: number;

    public equalValue(rhs: ColorHSL): boolean {
        return this.h === rhs.h && this.s === rhs.s && this.l === rhs.l;
    }

    public roundToPrecision(precision: number): ColorHSL {
        return new ColorHSL(
            roundToPrecisionSmall(this.h, precision),
            roundToPrecisionSmall(this.s, precision),
            roundToPrecisionSmall(this.l, precision)
        );
    }

    public toObject(): { h: number; s: number; l: number } {
        return { h: this.h, s: this.s, l: this.l };
    }
}
