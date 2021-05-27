import { PaletteRGB } from "../palette";
import { SwatchRGB } from "../swatch";
import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";

/**
 * @internal
 */
export function neutralLayerCard(
    palette: PaletteRGB,
    relativeLuminance: number,
    cardDelta: number
): SwatchRGB {
    return palette.get(
        palette.closestIndexOf(baseLayerLuminanceSwatch(relativeLuminance)) - cardDelta
    );
}
