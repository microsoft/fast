import { Palette } from "../palette.js";
import { Swatch } from "../swatch.js";
import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance.js";

/**
 * @internal
 */
export function neutralLayer1Index(palette: Palette, baseLayerLuminance: number): number {
    return palette.closestIndexOf(baseLayerLuminanceSwatch(baseLayerLuminance));
}

/**
 * @internal
 */
export function neutralLayer1(palette: Palette, baseLayerLuminance: number): Swatch {
    return palette.get(neutralLayer1Index(palette, baseLayerLuminance));
}
