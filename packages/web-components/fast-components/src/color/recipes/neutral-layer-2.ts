import { Palette } from "../palette.js";
import { Swatch } from "../swatch.js";
import { neutralLayer1Index } from "./neutral-layer-1.js";

/**
 * @internal
 */
export function neutralLayer2(
    palette: Palette,
    baseLayerLuminance: number,
    layerDelta: number
): Swatch {
    return palette.get(neutralLayer1Index(palette, baseLayerLuminance) + layerDelta);
}
