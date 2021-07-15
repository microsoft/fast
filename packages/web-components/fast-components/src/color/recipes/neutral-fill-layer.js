/**
 * @internal
 */
export function neutralFillLayer(palette, reference, delta) {
    const referenceIndex = palette.closestIndexOf(reference);
    return palette.get(referenceIndex - (referenceIndex < delta ? delta * -1 : delta));
}
