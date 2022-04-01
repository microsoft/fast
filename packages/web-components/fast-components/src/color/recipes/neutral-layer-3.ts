import { Palette } from "../palette.js";
import { Swatch } from "../swatch.js";
import { neutralLayer2Index } from "./neutral-layer-2.js";

/**
 * @internal
 */
export function neutralLayer3(
    palette: Palette,
    luminance: number,
    layerDelta: number,
    fillRestDelta: number,
    fillHoverDelta: number,
    fillActiveDelta: number
): Swatch {
    return palette.get(
        neutralLayer2Index(
            palette,
            luminance,
            layerDelta,
            fillRestDelta,
            fillHoverDelta,
            fillActiveDelta
        ) + layerDelta
    );
}
