import { Palette } from "../palette";
import { InteractiveSwatchSet } from "../recipe";
import { Swatch } from "../swatch";
/**
 * @internal
 */
export declare function neutralFillContrast(
    palette: Palette,
    reference: Swatch,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number
): InteractiveSwatchSet;
