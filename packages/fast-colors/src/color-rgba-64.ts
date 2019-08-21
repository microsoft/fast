// tslint:disable:member-ordering
import {
    clamp,
    denormalize,
    getHexStringForByte,
    roundToPrecisionSmall,
} from "./math-utilities";

export interface ColorRGBA64Config {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export class ColorRGBA64 {
    public static fromObject(data: ColorRGBA64Config): ColorRGBA64 | null {
        return data && !isNaN(data.r) && !isNaN(data.g) && !isNaN(data.b)
            ? new ColorRGBA64(data.r, data.g, data.b, data.a)
            : null;
    }

    constructor(red: number, green: number, blue: number, alpha?: number) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = typeof alpha === "number" && !isNaN(alpha) ? alpha : 1;
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
        return "#" + [this.r, this.g, this.b].map(this.formatHexValue).join("");
    }

    // #RRGGBBAA
    public toStringHexRGBA(): string {
        return this.toStringHexRGB() + this.formatHexValue(this.a);
    }

    // #AARRGGBB
    public toStringHexARGB(): string {
        return "#" + [this.a, this.r, this.g, this.b].map(this.formatHexValue).join("");
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

    public toObject(): Required<ColorRGBA64Config> {
        return { r: this.r, g: this.g, b: this.b, a: this.a };
    }

    private formatHexValue(value: number): string {
        return getHexStringForByte(denormalize(value, 0.0, 255.0));
    }
}
