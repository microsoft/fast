// tslint:disable:member-ordering
import { roundToPrecisionSmall } from "./math-utilities";

// XYZ color space
// https://en.wikipedia.org/wiki/CIE_1931_color_space
// This implementation uses the D65 constants for 2 degrees. That determines the constants used for the pure white point of the XYZ space of 0.95047, 1.0, 1.08883.
// https://en.wikipedia.org/wiki/Illuminant_D65
// These constants determine how the XYZ, LCH and LAB colors convert to/from RGB.
export class ColorXYZ {
    // D65 2 degree white point
    public static readonly whitePoint: ColorXYZ = new ColorXYZ(0.95047, 1.0, 1.08883);

    public static fromObject(data: { x: number; y: number; z: number }): ColorXYZ | null {
        if (data && !isNaN(data.x) && !isNaN(data.y) && !isNaN(data.z)) {
            return new ColorXYZ(data.x, data.y, data.z);
        }
        return null;
    }

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public readonly x: number;
    public readonly y: number;
    public readonly z: number;

    public equalValue(rhs: ColorXYZ): boolean {
        return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z;
    }

    public roundToPrecision(precision: number): ColorXYZ {
        return new ColorXYZ(
            roundToPrecisionSmall(this.x, precision),
            roundToPrecisionSmall(this.y, precision),
            roundToPrecisionSmall(this.z, precision)
        );
    }

    public toObject(): { x: number; y: number; z: number } {
        return { x: this.x, y: this.y, z: this.z };
    }
}
