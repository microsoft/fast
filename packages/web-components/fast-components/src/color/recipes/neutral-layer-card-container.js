import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";
/**
 * @internal
 */
export function neutralLayerCardContainer(palette, relativeLuminance, layerDelta) {
    return palette.get(
        palette.closestIndexOf(baseLayerLuminanceSwatch(relativeLuminance)) + layerDelta
    );
}
