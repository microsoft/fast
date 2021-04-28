import { Palette } from "../palette";
import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";

/**
 * @internal
 */
export function neutralLayerCard(
    palette: Palette,
    relativeLuminance: number,
    cardDelta: number
) {
    return palette.get(
        palette.closestIndexOf(baseLayerLuminanceSwatch(relativeLuminance)) - cardDelta
    );
}
