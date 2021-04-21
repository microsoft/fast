import { Palette } from "../palette";
import { neutralLayerCard } from "./neutral-layer-card";

/**
 * @internal
 */
export function neutralLayerFloating(
    palette: Palette,
    relativeLuminance: number,
    cardDelta: number
) {
    const cardIndex = palette.closestIndexOf(
        neutralLayerCard(palette, relativeLuminance, cardDelta)
    );
    return palette.get(cardIndex - cardDelta);
}
