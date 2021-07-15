/**
 * @internal
 */
export function neutralFillStealth(
    palette,
    reference,
    restDelta,
    hoverDelta,
    activeDelta,
    focusDelta,
    fillRestDelta,
    fillHoverDelta,
    fillActiveDelta,
    fillFocusDelta
) {
    const swapThreshold = Math.max(
        restDelta,
        hoverDelta,
        activeDelta,
        focusDelta,
        fillRestDelta,
        fillHoverDelta,
        fillActiveDelta,
        fillFocusDelta
    );
    const referenceIndex = palette.closestIndexOf(reference);
    const direction = referenceIndex >= swapThreshold ? -1 : 1;
    return {
        rest: palette.get(referenceIndex + direction * restDelta),
        hover: palette.get(referenceIndex + direction * hoverDelta),
        active: palette.get(referenceIndex + direction * activeDelta),
        focus: palette.get(referenceIndex + direction * focusDelta),
    };
}
