import { PaletteRGB } from "../palette";
import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";

/**
 * @internal
 */
export function neutralLayerCardContainer(
    palette: PaletteRGB,
    relativeLuminance: number,
    cardDelta: number
) {
    return palette.get(
        palette.closestIndexOf(baseLayerLuminanceSwatch(relativeLuminance)) + cardDelta
    );
}
