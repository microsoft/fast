import { Palette, PaletteDirection, resolvePaletteDirection } from "../palette.js";
import { InteractiveSwatchSet } from "../recipe.js";
import { Swatch } from "../swatch.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";

/**
 * Gets an interactive set of Swatches the specified positions away from the reference color.
 *
 * @param palette - The Palette used to find the Swatches
 * @param reference - The reference color
 * @param restDelta - The rest state offset from `reference`
 * @param hoverDelta - The hover state offset from `reference`
 * @param activeDelta - The active state offset from `reference`
 * @param focusDelta - The focus state offset from `reference`
 * @param direction - The direction the deltas move on the `palette`, defaults to {@link directionByIsDark} based on `reference`
 * @returns The interactive set of Swatches
 *
 * @public
 */
export function deltaSwatchSet(
    palette: Palette,
    reference: Swatch,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    direction: PaletteDirection = directionByIsDark(reference)
): InteractiveSwatchSet {
    const referenceIndex = palette.closestIndexOf(reference);
    const dir = resolvePaletteDirection(direction);

    return {
        rest: palette.get(referenceIndex + dir * restDelta),
        hover: palette.get(referenceIndex + dir * hoverDelta),
        active: palette.get(referenceIndex + dir * activeDelta),
        focus: palette.get(referenceIndex + dir * focusDelta),
    };
}
