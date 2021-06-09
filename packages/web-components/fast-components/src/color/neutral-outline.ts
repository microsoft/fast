import { FASTDesignSystem } from "../fast-design-system";
import {
    neutralOutlineActiveDelta,
    neutralOutlineFocusDelta,
    neutralOutlineHoverDelta,
    neutralOutlineRestDelta,
    neutralPalette,
} from "../fast-design-system";
import { findClosestBackgroundIndex, getSwatch, isDarkMode } from "./palette";
import {
    ColorRecipe,
    colorRecipeFactory,
    SwatchFamily,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common";

const neutralOutlineAlgorithm: SwatchFamilyResolver = (
    designSystem: FASTDesignSystem
): SwatchFamily => {
    const palette: string[] = neutralPalette(designSystem);
    const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
    const direction: 1 | -1 = isDarkMode(designSystem) ? -1 : 1;

    const restDelta: number = neutralOutlineRestDelta(designSystem);
    const restIndex: number = backgroundIndex + direction * restDelta;
    const hoverDelta: number = neutralOutlineHoverDelta(designSystem);
    const hoverIndex: number = restIndex + direction * (hoverDelta - restDelta);
    const activeDelta: number = neutralOutlineActiveDelta(designSystem);
    const activeIndex: number = restIndex + direction * (activeDelta - restDelta);
    const focusDelta: number = neutralOutlineFocusDelta(designSystem);
    const focusIndex: number = restIndex + direction * (focusDelta - restDelta);

    return {
        rest: getSwatch(restIndex, palette),
        hover: getSwatch(hoverIndex, palette),
        active: getSwatch(activeIndex, palette),
        focus: getSwatch(focusIndex, palette),
    };
};

/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralOutline_DEPRECATED: ColorRecipe<SwatchFamily> = colorRecipeFactory(
    neutralOutlineAlgorithm
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralOutlineRest_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    neutralOutline_DEPRECATED
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralOutlineHover_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    neutralOutline_DEPRECATED
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralOutlineActive_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    neutralOutline_DEPRECATED
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralOutlineFocus_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.focus,
    neutralOutline_DEPRECATED
);
