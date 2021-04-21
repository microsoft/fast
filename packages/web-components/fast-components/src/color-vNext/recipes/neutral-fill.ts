import { Palette } from "../palette";
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
export function neutralFill(
    palette: Palette,
    reference: Swatch,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    selectedDelta: number
) {
    const backgroundIndex = palette.closestIndexOf(reference);
    const threshold = Math.max(restDelta, hoverDelta, activeDelta, focusDelta);
    const direction = backgroundIndex >= threshold ? -1 : 1;

    return {
        rest: palette.get(backgroundIndex + direction * restDelta),
        hover: palette.get(backgroundIndex + direction * hoverDelta),
        active: palette.get(backgroundIndex + direction * activeDelta),
        focus: palette.get(backgroundIndex + direction * focusDelta),
        selected: palette.get(backgroundIndex + direction * selectedDelta),
    };
}
