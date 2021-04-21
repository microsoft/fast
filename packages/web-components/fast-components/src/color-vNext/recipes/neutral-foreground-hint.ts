import { Swatch } from "../swatch";
import { Palette } from "../palette";

/**
 * The neutralForegroundHint color recipe
 * @param palette - The palette to operate on
 * @param background - The background of the divider
 *
 * @internal
 */
export function neutralForegroundHint(palette: Palette, background: Swatch) {
    return palette.colorContrast(background, 4.5);
}
