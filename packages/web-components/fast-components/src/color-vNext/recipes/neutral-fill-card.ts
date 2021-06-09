import { PaletteRGB } from "../palette";
import { Swatch, SwatchRGB } from "../swatch";

/**
 * @internal
 */
export function neutralFillCard(
    palette: PaletteRGB,
    reference: Swatch,
    delta: number
): SwatchRGB {
    const referenceIndex = palette.closestIndexOf(reference);

    return palette.get(referenceIndex - (referenceIndex < delta ? delta * -1 : delta));
}
