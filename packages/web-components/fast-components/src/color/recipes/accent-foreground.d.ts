import { Palette } from "../palette";
import { InteractiveSwatchSet } from "../recipe";
import { Swatch } from "../swatch";
/**
 * @internal
 */
export declare function accentForeground(
    palette: Palette,
    reference: Swatch,
    contrastTarget: number,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number
): InteractiveSwatchSet;
