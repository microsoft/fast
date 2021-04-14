import { Palette } from "../palette";
import { Swatch } from "../swatch";

export function neutralFocus(palette: Palette, reference: Swatch) {
    return palette.colorContrast(reference, 3.5);
}
