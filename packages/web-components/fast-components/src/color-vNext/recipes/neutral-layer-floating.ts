import { PaletteRGB } from "../palette";
import { SwatchRGB } from "../swatch";
import { neutralLayerCard } from "./neutral-layer-card";

/**
 * @internal
 */
export function neutralLayerFloating(
    palette: PaletteRGB,
    relativeLuminance: number,
    cardDelta: number
): SwatchRGB {
    const cardIndex = palette.closestIndexOf(
        neutralLayerCard(palette, relativeLuminance, cardDelta)
    );
    return palette.get(cardIndex - cardDelta);
}
