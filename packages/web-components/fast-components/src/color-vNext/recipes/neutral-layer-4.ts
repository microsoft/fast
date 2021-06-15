import { PaletteRGB } from "../palette";
import { SwatchRGB } from "../swatch";
import { neutralLayer2Index } from "./neutral-layer-2";

/**
 * @internal
 */
export function neutralLayer4(
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
        ) +
            layerDelta * 2
    );
}
