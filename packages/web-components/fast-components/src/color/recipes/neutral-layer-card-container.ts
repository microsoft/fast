import { Palette } from "../palette";
import { Swatch } from "../swatch";
import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";

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
