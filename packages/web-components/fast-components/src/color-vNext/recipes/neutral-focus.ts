import { PaletteRGB } from "../palette";
import { Swatch, SwatchRGB } from "../swatch";

/**
 * @internal
 */
export function neutralFocus(palette: PaletteRGB, reference: Swatch): SwatchRGB {
    return palette.colorContrast(reference, 3.5);
}
