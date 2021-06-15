import { PaletteRGB } from "../palette";
import { Swatch, SwatchRGB } from "../swatch";
import { directionByIsDark } from "../utilities/direction-by-is-dark";

/**
 * @internal
 */
export function neutralFillInput(
    palette: PaletteRGB,
    reference: Swatch,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number
): Record<"rest" | "hover" | "active" | "focus", SwatchRGB> {
    const direction = directionByIsDark(reference);
    const referenceIndex = palette.closestIndexOf(reference);

    return {
        rest: palette.get(referenceIndex - direction * restDelta),
        hover: palette.get(referenceIndex - direction * hoverDelta),
        active: palette.get(referenceIndex - direction * activeDelta),
        focus: palette.get(referenceIndex - direction * focusDelta),
    };
}
