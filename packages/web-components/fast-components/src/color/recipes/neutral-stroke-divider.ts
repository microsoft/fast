import { Swatch } from "../swatch.js";
import { Palette } from "../palette.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";

/**
 * The neutralStrokeDivider color recipe
 * @param palette - The palette to operate on
 * @param reference - The reference color
 * @param delta - The offset from the reference
 *
 * @internal
 */
export function neutralStrokeDivider(
    palette: Palette,
    reference: Swatch,
    delta: number
): Swatch {
    return palette.get(
        palette.closestIndexOf(reference) + directionByIsDark(reference) * delta
    );
}
