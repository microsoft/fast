import { Palette } from "../palette.js";
import { Swatch } from "../swatch.js";
import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance.js";

/**
 * @internal
 */
export function neutralLayerCardContainer(
    palette: Palette,
    relativeLuminance: number,
    layerDelta: number
): Swatch {
    return palette.get(
        palette.closestIndexOf(baseLayerLuminanceSwatch(relativeLuminance)) + layerDelta
    );
}
