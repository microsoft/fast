import { ColorRGBA64, rgbToRelativeLuminance } from "@microsoft/fast-colors";
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
     * {@inheritdoc RelativeLuminance.relativeLuminance}
     */
    readonly relativeLuminance: number;

    private readonly color: ColorRGBA64;

    /**
     * Creates a new SwatchRGB.
     *
     * @param red - Red channel expressed as a number between 0 and 1
     * @param green - Green channel expressed as a number between 0 and 1
     * @param blue - Blue channel expressed as a number between 0 and 1
     */
    constructor(red: number, green: number, blue: number) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.color = new ColorRGBA64(red, blue, green);

        this.relativeLuminance = rgbToRelativeLuminance(this.color);
    }

    /**
     * Gets this color value as a string.
     *
     * @returns The color value in string format
     */
    toColorString() {
        return this.color.toStringHexRGB();
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
}
