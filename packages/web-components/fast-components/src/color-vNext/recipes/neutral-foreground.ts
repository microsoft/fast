import { Palette } from "../palette";
import { Swatch } from "../swatch";

/**
 * @internal
 */
export function neutralForeground(palette: Palette, reference: Swatch) {
    return palette.colorContrast(reference, 14);
}
