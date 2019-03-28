// tslint:disable:member-ordering
import {
    clamp,
    denormalize,
    getHexStringForByte,
    roundToPrecisionSmall,
} from "./math-utilities";

export class ColorRGBA64 {
    public static fromObject(data: {
        r: number;
        g: number;
        b: number;
        a: number;
    }): ColorRGBA64 | null {
        if (data && !isNaN(data.r) && !isNaN(data.g) && !isNaN(data.b)) {
            if (!isNaN(data.a)) {
                return new ColorRGBA64(data.r, data.g, data.b, data.a);
            } else {
                return new ColorRGBA64(data.r, data.g, data.b, 1);
            }
        }
        return null;
    }

    constructor(red: number, green: number, blue: number, alpha: number) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = alpha;
    }

    // Scaled to the range [0.0 , 1.0]. Values outside this range are allowed but any methods that convert or tostring the values will also be clamped
    public readonly r: number;
    public readonly g: number;
    public readonly b: number;
    public readonly a: number;

    public equalValue(rhs: ColorRGBA64): boolean {
        return (
            this.r === rhs.r && this.g === rhs.g && this.b === rhs.b && this.a === rhs.a
        );
    }

    // #RRGGBB
    public toStringHexRGB(): string {
        return (
            "#" +
            getHexStringForByte(denormalize(this.r, 0.0, 255.0)) +
            getHexStringForByte(denormalize(this.g, 0.0, 255.0)) +
            getHexStringForByte(denormalize(this.b, 0.0, 255.0))
        );
    }

    // #RRGGBBAA
    public toStringHexRGBA(): string {
        return (
            this.toStringHexRGB() + getHexStringForByte(denormalize(this.a, 0.0, 255.0))
        );
    }

    // #AARRGGBB
    public toStringHexARGB(): string {
        return (
            "#" +
            getHexStringForByte(denormalize(this.a, 0.0, 255.0)) +
            getHexStringForByte(denormalize(this.r, 0.0, 255.0)) +
            getHexStringForByte(denormalize(this.g, 0.0, 255.0)) +
            getHexStringForByte(denormalize(this.b, 0.0, 255.0))
        );
    }

    // rgb(0xRR, 0xGG, 0xBB)
    public toStringWebRGB(): string {
        return `rgb(${Math.round(denormalize(this.r, 0.0, 255.0))},${Math.round(
            denormalize(this.g, 0.0, 255.0)
        )},${Math.round(denormalize(this.b, 0.0, 255.0))})`;
    }

    // rgba(0xRR, 0xGG, 0xBB, a)
    // Note that this follows the convention of putting alpha in the range [0.0,1.0] while the other three channels are [0,255]
    public toStringWebRGBA(): string {
        return `rgba(${Math.round(denormalize(this.r, 0.0, 255.0))},${Math.round(
            denormalize(this.g, 0.0, 255.0)
        )},${Math.round(denormalize(this.b, 0.0, 255.0))},${clamp(this.a, 0, 1)})`;
    }

    public roundToPrecision(precision: number): ColorRGBA64 {
        return new ColorRGBA64(
            roundToPrecisionSmall(this.r, precision),
            roundToPrecisionSmall(this.g, precision),
            roundToPrecisionSmall(this.b, precision),
            roundToPrecisionSmall(this.a, precision)
        );
    }

    public clamp(): ColorRGBA64 {
        return new ColorRGBA64(
            clamp(this.r, 0, 1),
            clamp(this.g, 0, 1),
            clamp(this.b, 0, 1),
            clamp(this.a, 0, 1)
        );
    }

    public toObject(): { r: number; g: number; b: number; a: number } {
        return { r: this.r, g: this.g, b: this.b, a: this.a };
    }
}
