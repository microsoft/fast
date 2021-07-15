import { directionByIsDark } from "../utilities/direction-by-is-dark";
/** @internal */
export function focusStrokeOuter(palette, reference) {
    return palette.colorContrast(reference, 3.5);
}
/** @internal */
export function focusStrokeInner(palette, reference, focusColor) {
    return palette.colorContrast(
        focusColor,
        3.5,
        palette.closestIndexOf(palette.source),
        directionByIsDark(reference) * -1
    );
}
