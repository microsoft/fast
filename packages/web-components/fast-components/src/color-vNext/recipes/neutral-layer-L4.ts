import { PaletteRGB } from "../palette";
import { SwatchRGB } from "../swatch";
import { neutralLayerL2Index } from "./neutral-layer-L2";

/**
 * @internal
 */
export function neutralLayerL4(
    palette: PaletteRGB,
    luminance: number,
    layerDelta: number,
    fillRestDelta: number,
    fillHoverDelta: number,
    fillActiveDelta: number
): SwatchRGB {
    return palette.get(
        neutralLayerL2Index(
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
