import { Palette } from "../palette";
import { InteractiveSwatchSet } from "../recipe";
import { Swatch } from "../swatch";
import { directionByIsDark } from "../utilities/direction-by-is-dark";

/**
 * Color algorithm using deltas from the reference color for states.
 *
 * @param palette The palette to operate on
 * @param reference The reference color to calculate a color for
 * @param restDelta The rest state offset from reference
 * @param hoverDelta The hover state offset from reference
 * @param activeDelta The active state offset from reference
 * @param focusDelta The focus state offset from reference
 * @param direction The direction the deltas move on the ramp, default goes darker for light references and lighter for dark references
 *
 * @internal
 */
export function deltaSwatchSet(
    palette: Palette,
    reference: Swatch,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    direction?: -1 | 1 | null
): InteractiveSwatchSet {
    const referenceIndex = palette.closestIndexOf(reference);
    if (direction === null || direction === void 0) {
        direction = directionByIsDark(reference);
    }

    return {
        rest: palette.get(referenceIndex + direction * restDelta),
        hover: palette.get(referenceIndex + direction * hoverDelta),
        active: palette.get(referenceIndex + direction * activeDelta),
        focus: palette.get(referenceIndex + direction * focusDelta),
    };
}
