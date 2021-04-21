import { Swatch } from "../swatch";
import { Palette } from "../palette";
import { directionByIsDark } from "../utilities/direction-by-is-dark";

/**
 * The neutralDivider color recipe
 * @param palette - The palette to operate on
 * @param background - The background of the divider
 * @param offset - The offset from the background
 *
 * @internal
 */
export function neutralDivider(palette: Palette, background: Swatch, offset: number) {
    const direction = directionByIsDark(background);

    return palette.get(palette.closestIndexOf(background) + direction * offset);
}
