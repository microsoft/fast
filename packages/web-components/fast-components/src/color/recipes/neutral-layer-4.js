import { neutralLayer2Index } from "./neutral-layer-2";
/**
 * @internal
 */
export function neutralLayer4(
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
        ) +
            layerDelta * 2
    );
}
