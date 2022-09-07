import {
    calculateOverlayColor,
    ColorRGBA64,
    rgbToRelativeLuminance,
} from "@microsoft/fast-colors";
import { contrast, RelativeLuminance } from "./utilities/relative-luminance.js";

/**
 * Represents a color in a {@link Palette}.
 *
 * @public
 */
export interface Swatch extends RelativeLuminance {
    /**
     * Gets a string representation of the color.
     */
    toColorString(): string;

    /**
     * Gets the contrast between this Swatch and another one.
     * @param target - The relative luminance for comparison
     */
    contrast(target: RelativeLuminance): number;
}

/**
 * Represents a color in a {@link Palette} using RGB.
 *
 * @public
 */
export class SwatchRGB implements Swatch {
    /**
     * Red channel expressed as a number between 0 and 1.
     */
    readonly r: number;

    /**
     * Green channel expressed as a number between 0 and 1.
     */
    readonly g: number;

    /**
     * Blue channel expressed as a number between 0 and 1.
     */
    readonly b: number;

    /**
     * The opaque color this Swatch represents if opacity is used.
     */
    readonly intendedColor?: SwatchRGB;

    /**
     * {@inheritdoc RelativeLuminance.relativeLuminance}
     */
    readonly relativeLuminance: number;

    /**
     * Internal representation of the Swatch in the format used by fast-colors.
     */
    readonly color: ColorRGBA64;

    /**
     * Creates a new SwatchRGB.
     *
     * @param red - Red channel expressed as a number between 0 and 1
     * @param green - Green channel expressed as a number between 0 and 1
     * @param blue - Blue channel expressed as a number between 0 and 1
     * @param alpha - Alpha channel expressed as a number between 0 and 1, default 1
     * @param intendedColor - If `alpha` < 1 this tracks the intended opaque color value for dependent calculations
     */
    constructor(
        red: number,
        green: number,
        blue: number,
        alpha: number = 1,
        intendedColor?: SwatchRGB
    ) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.color = new ColorRGBA64(red, green, blue, alpha);

        this.intendedColor = intendedColor;
        this.relativeLuminance = intendedColor
            ? rgbToRelativeLuminance(intendedColor.color)
            : rgbToRelativeLuminance(this.color);
    }

    /**
     * Gets this color value as a string.
     *
     * @returns The color value in string format
     */
    toColorString() {
        return this.color.a < 1
            ? this.color.toStringWebRGBA()
            : this.color.toStringHexRGB();
    }

    /**
     * Gets the contrast between this Swatch and another.
     *
     * @returns The contrast between the two luminance values, for example, 4.54
     */
    contrast = contrast.bind(null, this);

    /**
     * Gets this color value as a string for use in css.
     *
     * @returns The color value in a valid css string format
     */
    createCSS = this.toColorString;

    /**
     * Creates a new SwatchRGB from and object with R, G, and B values expressed as a number between 0 to 1.
     *
     * @param obj - An object with `r`, `g`, and `b` values expressed as a number between 0 and 1
     * @returns A new SwatchRGB
     */
    static from(obj: { r: number; g: number; b: number }): SwatchRGB {
        return new SwatchRGB(obj.r, obj.g, obj.b);
    }

    /**
     * Creates a new SwatchRGB as an overlay representation of the `intendedColor` over `reference`.
     *
     * Currently the overlay will only be black or white, so this works best with a plain grey neutral palette.
     * Otherwise it will attempt to match the luminance value of the Swatch, so it will likely be close, but not an
     * exact match to the color from another palette.
     *
     * @param intendedColor - The color the overlay should look like over the `reference` color
     * @param reference - The color under the overlay color
     * @returns A semitransparent color that implies the `intendedColor` over the `reference` color.
     */
    static asOverlay(intendedColor: SwatchRGB, reference: SwatchRGB): SwatchRGB {
        const refColor = reference.intendedColor ?? reference;
        const colorWithAlpha = calculateOverlayColor(intendedColor.color, refColor.color);

        return new SwatchRGB(
            colorWithAlpha.r,
            colorWithAlpha.g,
            colorWithAlpha.b,
            colorWithAlpha.a,
            intendedColor
        );
    }
}
