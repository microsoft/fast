import { PaletteRGB } from "../palette";
import { SwatchRGB } from "../swatch";
import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";

/**
 * @internal
 */
export function neutralLayerCardContainer(
    palette: PaletteRGB,
    relativeLuminance: number,
    layerDelta: number
): SwatchRGB {
    return palette.get(
        palette.closestIndexOf(baseLayerLuminanceSwatch(relativeLuminance)) + layerDelta
    );
}
