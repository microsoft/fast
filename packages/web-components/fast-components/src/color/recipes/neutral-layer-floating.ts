import { Palette } from "../palette.js";
import { Swatch } from "../swatch.js";
import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance.js";

/**
 * @internal
 */
export function neutralLayerFloating(
    palette: Palette,
    relativeLuminance: number,
    layerDelta: number
): Swatch {
    const cardIndex =
        palette.closestIndexOf(baseLayerLuminanceSwatch(relativeLuminance)) - layerDelta;
    return palette.get(cardIndex - layerDelta);
}
