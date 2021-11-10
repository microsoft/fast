import { Palette } from "../palette.js";
import { InteractiveSwatchSet } from "../recipe.js";
import { Swatch } from "../swatch.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";

/**
 * @internal
 */
export function neutralForeground(
    palette: Palette,
    reference: Swatch,
    restContrast: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number
): InteractiveSwatchSet {
    const direction = directionByIsDark(reference);
    const restSwatch = palette.colorContrast(reference, restContrast);
    const restIndex = palette.closestIndexOf(restSwatch);

    return {
        rest: restSwatch,
        hover: palette.get(restIndex + direction * hoverDelta),
        active: palette.get(restIndex + direction * activeDelta),
        focus: palette.get(restIndex + direction * focusDelta),
    };
}
