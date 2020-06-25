import {
    clamp,
    denormalize,
    getHexStringForByte,
    roundToPrecisionSmall,
} from "./math-utilities";

/**
 * Configuration object for {@link ColorRGBA64}
 * @public
 */
export interface ColorRGBA64Config {
    r: number;
    g: number;
    b: number;
    a?: number;
}

/**
 * A RGBA color with 64 bit channels.
 *
 * @example
 * ```ts
 * new ColorRGBA64(1, 0, 0, 1) // red
 * ```
 * @public
 */
export class ColorRGBA64 {
    /**
     * Construct a {@link ColorRGBA64} from a {@link ColorRGBA64Config}
     * @param data - the config object
     */
    public static fromObject(data: ColorRGBA64Config): ColorRGBA64 | null {
        return data && !isNaN(data.r) && !isNaN(data.g) && !isNaN(data.b)
            ? new ColorRGBA64(data.r, data.g, data.b, data.a)
            : null;
    }

    /**
     *
     * @param red - the red value
     * @param green - the green value
     * @param blue - the blue value
     * @param alpha - the alpha value
     */
    constructor(red: number, green: number, blue: number, alpha?: number) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = typeof alpha === "number" && !isNaN(alpha) ? alpha : 1;
    }

    /**
     * The red value
     * @remarks
     * Scaled to the range [0.0 , 1.0]. Values outside this range are allowed but any methods that convert or tostring the values will also be clamped
     */
    public readonly r: number;

    /**
     * The green value
     * @remarks
     * Scaled to the range [0.0 , 1.0]. Values outside this range are allowed but any methods that convert or tostring the values will also be clamped
     */
    public readonly g: number;

    /**
     * The blue value
     * @remarks
     * Scaled to the range [0.0 , 1.0]. Values outside this range are allowed but any methods that convert or tostring the values will also be clamped
     */
    public readonly b: number;

    /**
     * The alpha value
     * @remarks
     * Scaled to the range [0.0 , 1.0]. Values outside this range are allowed but any methods that convert or tostring the values will also be clamped
     */
    public readonly a: number;

    /**
     * Determines if one color is equal to another.
     * @param rhs - the color to compare
     */
    public equalValue(rhs: ColorRGBA64): boolean {
        return (
            this.r === rhs.r && this.g === rhs.g && this.b === rhs.b && this.a === rhs.a
        );
    }

    /**
     * Returns the color formatted as a string; #RRGGBB
     */
    public toStringHexRGB(): string {
        return "#" + [this.r, this.g, this.b].map(this.formatHexValue).join("");
    }

    /**
     * Returns the color formatted as a string; #RRGGBBAA
     */
    public toStringHexRGBA(): string {
        return this.toStringHexRGB() + this.formatHexValue(this.a);
    }

    /**
     * Returns the color formatted as a string; #AARRGGBB
     */
    public toStringHexARGB(): string {
        return "#" + [this.a, this.r, this.g, this.b].map(this.formatHexValue).join("");
    }

    /**
     * Returns the color formatted as a string; "rgb(0xRR, 0xGG, 0xBB)"
     */
    public toStringWebRGB(): string {
        return `rgb(${Math.round(denormalize(this.r, 0.0, 255.0))},${Math.round(
            denormalize(this.g, 0.0, 255.0)
        )},${Math.round(denormalize(this.b, 0.0, 255.0))})`;
    }

    /**
     * Returns the color formatted as a string; "rgba(0xRR, 0xGG, 0xBB, a)"
     * @remarks
     * Note that this follows the convention of putting alpha in the range [0.0,1.0] while the other three channels are [0,255]
     */
    public toStringWebRGBA(): string {
        return `rgba(${Math.round(denormalize(this.r, 0.0, 255.0))},${Math.round(
            denormalize(this.g, 0.0, 255.0)
        )},${Math.round(denormalize(this.b, 0.0, 255.0))},${clamp(this.a, 0, 1)})`;
    }

    /**
     * Returns a new {@link ColorRGBA64} rounded to the provided precision
     * @param precision - the precision to round to
     */
    public roundToPrecision(precision: number): ColorRGBA64 {
        return new ColorRGBA64(
            roundToPrecisionSmall(this.r, precision),
            roundToPrecisionSmall(this.g, precision),
            roundToPrecisionSmall(this.b, precision),
            roundToPrecisionSmall(this.a, precision)
        );
    }

    /**
     * Returns a new {@link ColorRGBA64} with channel values clamped between 0 and 1.
     */
    public clamp(): ColorRGBA64 {
        return new ColorRGBA64(
            clamp(this.r, 0, 1),
            clamp(this.g, 0, 1),
            clamp(this.b, 0, 1),
            clamp(this.a, 0, 1)
        );
    }

    /**
     * Converts the {@link ColorRGBA64} to a {@link ColorRGBA64Config}.
     */
    public toObject(): Required<ColorRGBA64Config> {
        return { r: this.r, g: this.g, b: this.b, a: this.a };
    }

    private formatHexValue(value: number): string {
        return getHexStringForByte(denormalize(value, 0.0, 255.0));
    }
}
