// tslint:disable:member-ordering
import { roundToPrecisionSmall } from "./mathUtils";

// This uses Hue values in "degree" format. So expect a range of [0,360]. Some other implementations instead uses radians or a normalized Hue with range [0,1]. Be aware of this when checking values or using other libraries.
export class ColorHSV {
    public static fromObject(data: any): ColorHSV | null {
        if (data && !isNaN(data.h) && !isNaN(data.s) && !isNaN(data.v)) {
            return new ColorHSV(data.h, data.s, data.v);
        }
        return null;
    }

    constructor(hue: number, sat: number, val: number) {
        this.h = hue;
        this.s = sat;
        this.v = val;
    }

    public readonly h: number;
    public readonly s: number;
    public readonly v: number;

    public equalValue(rhs: ColorHSV): boolean {
        return this.h === rhs.h && this.s === rhs.s && this.v === rhs.v;
    }

    public roundToPrecision(precision: number): ColorHSV {
        return new ColorHSV(
            roundToPrecisionSmall(this.h, precision),
            roundToPrecisionSmall(this.s, precision),
            roundToPrecisionSmall(this.v, precision)
        );
    }

    public toObject(): object {
        return { h: this.h, s: this.s, v: this.v };
    }
}
