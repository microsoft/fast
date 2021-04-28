import { Palette } from "../palette";
import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";

export function neutralLayerL2(
    palette: Palette,
    luminance: number,
    cardDelta: number,
    fillRestDelta: number,
    fillHoverDelta: number,
    fillActiveDelta: number
) {
    const index = Math.max(
        palette.closestIndexOf(baseLayerLuminanceSwatch(luminance)) + cardDelta,
        fillRestDelta,
        fillHoverDelta,
        fillActiveDelta
    );
    return palette.get(index);
}
