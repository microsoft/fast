import { Palette } from "../palette";
import { Swatch } from "../swatch";
import { directionByMode } from "../utilities/direction-by-mode";

/**
 * @internal
 */
export function neutralOutline(
    palette: Palette,
    reference: Swatch,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number
) {
    const backgroundIndex = palette.closestIndexOf(reference);
    const direction = directionByMode(reference);

    const restIndex = backgroundIndex + direction * restDelta;
    const hoverIndex = restIndex + direction * (hoverDelta - restDelta);
    const activeIndex = restIndex + direction * (activeDelta - restDelta);
    const focusIndex = restIndex + direction * (focusDelta - restDelta);

    return {
        rest: palette.get(restIndex),
        hover: palette.get(hoverIndex),
        active: palette.get(activeIndex),
        focus: palette.get(focusIndex),
    };
}
