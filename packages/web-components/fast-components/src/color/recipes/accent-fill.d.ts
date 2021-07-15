import { Palette } from "../palette";
import { InteractiveSwatchSet } from "../recipe";
import { Swatch } from "../swatch";
/**
 * @internal
 */
export declare function accentFill(
    palette: Palette,
    neutralPalette: Palette,
    reference: Swatch,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    neutralFillRestDelta: number,
    neutralFillHoverDelta: number,
    neutralFillActiveDelta: number
): InteractiveSwatchSet;
