import { PaletteRGB } from "../palette";
import { Swatch, SwatchRGB } from "../swatch";

/**
 * @internal
 */
export function neutralForeground(palette: PaletteRGB, reference: Swatch): SwatchRGB {
    return palette.colorContrast(reference, 14);
}
