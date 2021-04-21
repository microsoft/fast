import { ColorRGBA64, rgbToRelativeLuminance } from "@microsoft/fast-colors";
import { contrast, RelativeLuminance } from "./utilities/relative-luminance";

/**
 * @public
 */
export interface Swatch extends RelativeLuminance {
    toColorString(): string;
    contrast(target: RelativeLuminance): number;
}

/**
 * @public
 */
export class SwatchRGB extends ColorRGBA64 implements Swatch {
    readonly relativeLuminance: number;
    constructor(red: number, green: number, blue: number) {
        super(red, green, blue, 1);
        this.relativeLuminance = rgbToRelativeLuminance(this);
    }

    public toColorString = this.toStringHexRGB;
    public contrast = contrast.bind(null, this);
}
