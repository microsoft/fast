import { Palette } from "../palette";
import { InteractiveSwatchSet } from "../recipe";
import { Swatch } from "../swatch";
import { directionByIsDark } from "../utilities/direction-by-is-dark";

/**
 * @internal
 */
export function contrastAndDeltaSwatchSet(
    palette: Palette,
    reference: Swatch,
    baseContrast: number,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    direction?: -1 | 1 | null
): InteractiveSwatchSet {
    if (direction === null || direction === void 0) {
        direction = directionByIsDark(reference);
    }
    const baseIndex = palette.closestIndexOf(
        palette.colorContrast(reference, baseContrast)
    );

    return {
        rest: palette.get(baseIndex + direction * restDelta),
        hover: palette.get(baseIndex + direction * hoverDelta),
        active: palette.get(baseIndex + direction * activeDelta),
        focus: palette.get(baseIndex + direction * focusDelta),
    };
}
