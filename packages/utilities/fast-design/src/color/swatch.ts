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

    public toColorString() {
        return this.color.toStringHexRGB();
    }

    public contrast = contrast.bind(null, this);

    public createCSS = this.toColorString;

    /**
     * Creates a new SwatchRGB from individual R, G, and B values expressed as a number between 0 to 1.
     *
     * @param r - Red channel expressed as a number between 0 and 1
     * @param g - Green channel expressed as a number between 0 and 1
     * @param b - Blue channel expressed as a number between 0 and 1
     * @returns A new SwatchRGB
     */
    public static create(r: number, g: number, b: number): SwatchRGB {
        return new SwatchRGB(r, g, b);
    }

    /**
     * Creates a new SwatchRGB from and object with R, G, and B values expressed as a number between 0 to 1.
     *
     * @param obj - An object with `r`, `g`, and `b` values expressed as a number between 0 and 1
     * @returns A new SwatchRGB
     */
    public static from(obj: { r: number; g: number; b: number }): SwatchRGB {
        return new SwatchRGB(obj.r, obj.g, obj.b);
    }
}

/**
 * Runtime test for an object's conformance with the {@link SwatchRGB} implementation.
 *
 * @param value - An object, which may or may not be a
 * @returns True if the `value` is a SwatchRGB
 *
 * @internal
 */
// export function _isSwatchRGB(value: { [key: string]: any }): value is SwatchRGB {
//     const test: SwatchRGB = {
//         r: 0,
//         g: 0,
//         b: 0,
//         toColorString: () => "",
//         contrast: () => 0,
//         relativeLuminance: 0,
//     };

//     (Object.keys(test) as [keyof SwatchRGB]).forEach(key => {
//         if (typeof test[key] !== typeof value[key]) {
//             return false;
//         }
//     });

//     return true;
// }

/**
 * An RGB implementation of {@link Swatch}.
 *
 * @internal
 */
// class SwatchRGBImpl extends ColorRGBA64 implements SwatchRGB {
//     readonly relativeLuminance: number;

//     /**
//      *
//      * @param red - Red channel expressed as a number between 0 and 1
//      * @param green - Green channel expressed as a number between 0 and 1
//      * @param blue - Blue channel expressed as a number between 0 and 1
//      */
//     constructor(red: number, green: number, blue: number) {
//         super(red, green, blue, 1);
//         this.relativeLuminance = rgbToRelativeLuminance(this);
//     }

//     public toColorString = this.toStringHexRGB;
//     public contrast = contrast.bind(null, this);
//     public createCSS = this.toColorString;

//     static fromObject(obj: { r: number; g: number; b: number }) {
//         return new SwatchRGBImpl(obj.r, obj.g, obj.b);
//     }
// }
