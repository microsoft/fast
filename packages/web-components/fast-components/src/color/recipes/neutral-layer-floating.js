import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";
/**
 * @internal
 */
export function neutralLayerFloating(palette, relativeLuminance, layerDelta) {
    const cardIndex =
        palette.closestIndexOf(baseLayerLuminanceSwatch(relativeLuminance)) - layerDelta;
    return palette.get(cardIndex - layerDelta);
}
