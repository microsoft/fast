import { SwatchRGB } from "../swatch";

export function baseLayerLuminanceSwatch(luminance: number) {
    return new SwatchRGB(luminance, luminance, luminance);
}
