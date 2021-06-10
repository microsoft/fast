import { PaletteRGB } from "../palette";
import { SwatchRGB } from "../swatch";
import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";

/**
 * @internal
 */
export function neutralLayerFloating(
    palette: PaletteRGB,
    relativeLuminance: number,
    layerDelta: number
): SwatchRGB {
    const cardIndex =
        palette.closestIndexOf(baseLayerLuminanceSwatch(relativeLuminance)) - layerDelta;
    return palette.get(cardIndex - layerDelta);
}
