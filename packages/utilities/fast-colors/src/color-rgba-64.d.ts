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
export declare class ColorRGBA64 {
    /**
     * Construct a {@link ColorRGBA64} from a {@link ColorRGBA64Config}
     * @param data - the config object
     */
    static fromObject(data: ColorRGBA64Config): ColorRGBA64 | null;
    /**
     *
     * @param red - the red value
     * @param green - the green value
     * @param blue - the blue value
     * @param alpha - the alpha value
     */
    constructor(red: number, green: number, blue: number, alpha?: number);
    /**
     * The red value
     * @remarks
     * Scaled to the range [0.0 , 1.0]. Values outside this range are allowed but any methods that convert or tostring the values will also be clamped
     */
    readonly r: number;
    /**
     * The green value
     * @remarks
     * Scaled to the range [0.0 , 1.0]. Values outside this range are allowed but any methods that convert or tostring the values will also be clamped
     */
    readonly g: number;
    /**
     * The blue value
     * @remarks
     * Scaled to the range [0.0 , 1.0]. Values outside this range are allowed but any methods that convert or tostring the values will also be clamped
     */
    readonly b: number;
    /**
     * The alpha value
     * @remarks
     * Scaled to the range [0.0 , 1.0]. Values outside this range are allowed but any methods that convert or tostring the values will also be clamped
     */
    readonly a: number;
    /**
     * Determines if one color is equal to another.
     * @param rhs - the color to compare
     */
    equalValue(rhs: ColorRGBA64): boolean;
    /**
     * Returns the color formatted as a string; #RRGGBB
     */
    toStringHexRGB(): string;
    /**
     * Returns the color formatted as a string; #RRGGBBAA
     */
    toStringHexRGBA(): string;
    /**
     * Returns the color formatted as a string; #AARRGGBB
     */
    toStringHexARGB(): string;
    /**
     * Returns the color formatted as a string; "rgb(0xRR, 0xGG, 0xBB)"
     */
    toStringWebRGB(): string;
    /**
     * Returns the color formatted as a string; "rgba(0xRR, 0xGG, 0xBB, a)"
     * @remarks
     * Note that this follows the convention of putting alpha in the range [0.0,1.0] while the other three channels are [0,255]
     */
    toStringWebRGBA(): string;
    /**
     * Returns a new {@link ColorRGBA64} rounded to the provided precision
     * @param precision - the precision to round to
     */
    roundToPrecision(precision: number): ColorRGBA64;
    /**
     * Returns a new {@link ColorRGBA64} with channel values clamped between 0 and 1.
     */
    clamp(): ColorRGBA64;
    /**
     * Converts the {@link ColorRGBA64} to a {@link ColorRGBA64Config}.
     */
    toObject(): Required<ColorRGBA64Config>;
    private formatHexValue;
}
