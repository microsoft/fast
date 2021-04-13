import { ColorRGBA64, rgbToRelativeLuminance } from "@microsoft/fast-colors";
import { contrast, RelativeLuminance } from "./utilities/relative-luminance";

export interface Swatch extends RelativeLuminance {
    toColorSting(): string;
    contrast(target: RelativeLuminance): number;
}

export class SwatchRGB extends ColorRGBA64 implements Swatch {
    readonly relativeLuminance: number;
    constructor(red: number, green: number, blue: number) {
        super(red, green, blue, 1);
        this.relativeLuminance = rgbToRelativeLuminance(this);
    }

    toColorSting = this.toStringHexRGB;
    contrast(target: RelativeLuminance): number {
        return contrast(this, target);
    }
}
