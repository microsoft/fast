import { Palette } from "../palette";
import { SwatchRGB } from "../swatch";

/**
 * @internal
 */
export function neutralLayerCard(
    palette: Palette,
    relativeLuminance: number,
    cardDelta: number
) {
    return palette.get(
        palette.closestIndexOf(
            new SwatchRGB(relativeLuminance, relativeLuminance, relativeLuminance)
        ) - cardDelta
    );
}
