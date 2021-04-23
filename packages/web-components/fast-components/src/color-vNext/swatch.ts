import { ColorRGBA64, rgbToRelativeLuminance } from "@microsoft/fast-colors";
import { contrast, RelativeLuminance } from "./utilities/relative-luminance";

/**
 * Represents a color in a {@link Palette}
 * @public
 */
export interface Swatch extends RelativeLuminance {
    toColorString(): string;
    contrast(target: RelativeLuminance): number;
}

/**
 * A RGB implementation of {@link Swatch}
 * @public
 */
export class SwatchRGB extends ColorRGBA64 implements Swatch {
    readonly relativeLuminance: number;

    /**
     *
     * @param red - Red channel expressed as a number between 0 and 1
     * @param green - Green channel expressed as a number between 0 and 1
     * @param blue - Blue channel expressed as a number between 0 and 1
     */
    constructor(red: number, green: number, blue: number) {
        super(red, green, blue, 1);
        this.relativeLuminance = rgbToRelativeLuminance(this);
    }

    public toColorString = this.toStringHexRGB;
    public contrast = contrast.bind(null, this);
    public createCSS = this.toColorString;

    static fromObject(obj: { r: number; g: number; b: number }) {
        return new SwatchRGB(obj.r, obj.g, obj.b);
    }
}
