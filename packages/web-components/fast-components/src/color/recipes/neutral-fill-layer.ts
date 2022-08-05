import { Palette } from "../palette.js";
import { Swatch } from "../swatch.js";

/**
 * @internal
 */
export function neutralFillLayer(
    palette: Palette,
    reference: Swatch,
    delta: number
): Swatch {
    const referenceIndex = palette.closestIndexOf(reference);

    return palette.get(referenceIndex - (referenceIndex < delta ? delta * -1 : delta));
}
