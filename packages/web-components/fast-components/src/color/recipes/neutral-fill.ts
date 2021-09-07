import { Palette } from "../palette";
import { InteractiveSwatchSet } from "../recipe";
import { Swatch } from "../swatch";
import { directionByIsDark } from "../utilities/direction-by-is-dark";

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
    focusDelta: number
): InteractiveSwatchSet {
    const referenceIndex = palette.closestIndexOf(reference);
    const direction = directionByIsDark(reference);

    return {
        rest: palette.get(referenceIndex + direction * restDelta),
        hover: palette.get(referenceIndex + direction * hoverDelta),
        active: palette.get(referenceIndex + direction * activeDelta),
        focus: palette.get(referenceIndex + direction * focusDelta),
    };
}
