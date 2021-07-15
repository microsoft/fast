import { Palette } from "../palette";
import { InteractiveSwatchSet } from "../recipe";
import { Swatch } from "../swatch";
/**
 *
 * @param palette - The palette to operate on
 * @param reference - The reference color to calculate a color for
 * @param delta - The offset from the reference's location
 * @param threshold - Determines if a lighter or darker color than the reference will be picked.
 * @returns
 *
 * @internal
 */
export declare function neutralFill(
    palette: Palette,
    reference: Swatch,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number
): InteractiveSwatchSet;
