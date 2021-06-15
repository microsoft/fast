import { PaletteRGB } from "../palette";
import { SwatchRGB } from "../swatch";
import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";

/**
 * @internal
 */
export function neutralLayer2Index(
    palette: PaletteRGB,
    luminance: number,
    layerDelta: number,
    fillRestDelta: number,
    fillHoverDelta: number,
    fillActiveDelta: number
): number {
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
    palette: PaletteRGB,
    luminance: number,
    layerDelta: number,
    fillRestDelta: number,
    fillHoverDelta: number,
    fillActiveDelta: number
): SwatchRGB {
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
