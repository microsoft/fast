import { directionByIsDark } from "../utilities/direction-by-is-dark";
/**
 * @internal
 */
export function neutralFillInput(
    palette,
    reference,
    restDelta,
    hoverDelta,
    activeDelta,
    focusDelta
) {
    const direction = directionByIsDark(reference);
    const referenceIndex = palette.closestIndexOf(reference);
    return {
        rest: palette.get(referenceIndex - direction * restDelta),
        hover: palette.get(referenceIndex - direction * hoverDelta),
        active: palette.get(referenceIndex - direction * activeDelta),
        focus: palette.get(referenceIndex - direction * focusDelta),
    };
}
