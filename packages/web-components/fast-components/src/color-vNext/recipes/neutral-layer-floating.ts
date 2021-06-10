import { PaletteRGB } from "../palette";
import { SwatchRGB } from "../swatch";
import { neutralLayerL1 } from "./neutral-layer-L1";

/**
 * @internal
 */
export function neutralLayerFloating(
    palette: PaletteRGB,
    relativeLuminance: number,
    layerDelta: number
): SwatchRGB {
    const l1Index = palette.closestIndexOf(neutralLayerL1(palette, relativeLuminance));
    return palette.get(l1Index - layerDelta);
}
