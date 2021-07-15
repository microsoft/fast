import { Palette } from "../palette";
import { InteractiveSwatchSet } from "../recipe";
import { Swatch } from "../swatch";
/**
 * @internal
 */
export declare function neutralFillStealth(
    palette: Palette,
    reference: Swatch,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    fillRestDelta: number,
    fillHoverDelta: number,
    fillActiveDelta: number,
    fillFocusDelta: number
): InteractiveSwatchSet;
