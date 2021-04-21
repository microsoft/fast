import { Palette } from "../palette";
import { Swatch } from "../swatch";
import { directionByMode } from "../utilities/direction-by-mode";

/**
 * @internal
 */
export function neutralFillInput(
    palette: Palette,
    reference: Swatch,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    selectedDelta: number
) {
    const direction = directionByMode(reference);
    const referenceIndex = palette.closestIndexOf(reference);

    return {
        rest: palette.get(referenceIndex - direction * restDelta),
        hover: palette.get(referenceIndex - direction * hoverDelta),
        active: palette.get(referenceIndex - direction * activeDelta),
        focus: palette.get(referenceIndex - direction * focusDelta),
        selected: palette.get(referenceIndex - direction * selectedDelta),
    };
}
