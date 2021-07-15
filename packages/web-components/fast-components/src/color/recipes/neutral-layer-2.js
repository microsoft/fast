import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";
/**
 * @internal
 */
export function neutralLayer2Index(
    palette,
    luminance,
    layerDelta,
    fillRestDelta,
    fillHoverDelta,
    fillActiveDelta
) {
    return Math.max(
        palette.closestIndexOf(baseLayerLuminanceSwatch(luminance)) + layerDelta,
        fillRestDelta,
        fillHoverDelta,
        fillActiveDelta
    );
}
/**
 * @internal
 */
export function neutralLayer2(
    palette,
    luminance,
    layerDelta,
    fillRestDelta,
    fillHoverDelta,
    fillActiveDelta
) {
    return palette.get(
        neutralLayer2Index(
            palette,
            luminance,
            layerDelta,
            fillRestDelta,
            fillHoverDelta,
            fillActiveDelta
        )
    );
}
