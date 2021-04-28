import { Palette } from "../palette";
import { neutralLayerL2Index } from "./neutral-layer-L2";

export function neutralLayerL4(
    palette: Palette,
    luminance: number,
    cardDelta: number,
    fillRestDelta: number,
    fillHoverDelta: number,
    fillActiveDelta: number
) {
    return palette.get(
        neutralLayerL2Index(
            palette,
            luminance,
            cardDelta,
            fillRestDelta,
            fillHoverDelta,
            fillActiveDelta
        ) +
            cardDelta * 2
    );
}
