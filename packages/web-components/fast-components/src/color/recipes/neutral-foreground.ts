import { Palette } from "../palette.js";
import { Swatch } from "../swatch.js";

/**
 * @internal
 */
export function neutralForeground(palette: Palette, reference: Swatch): Swatch {
    return palette.colorContrast(reference, 14);
}
