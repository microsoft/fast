import { DesignSystemResolver, FASTDesignSystem } from "../fast-design-system";
import {
    neutralFillInputActiveDelta,
    neutralFillInputFocusDelta,
    neutralFillInputHoverDelta,
    neutralFillInputRestDelta,
    neutralFillInputSelectedDelta,
    neutralPalette,
} from "../fast-design-system";
import { findClosestBackgroundIndex, getSwatch, isDarkMode } from "./palette";
import { ColorRecipe, colorRecipeFactory, FillSwatchFamily, Swatch } from "./common";

/**
 * Algorithm for determining neutral backplate colors
 */
function neutralFillInputAlgorithm(
    indexResolver: DesignSystemResolver<number>
): DesignSystemResolver<Swatch> {
    return (designSystem: FASTDesignSystem): Swatch => {
        const direction: 1 | -1 = isDarkMode(designSystem) ? -1 : 1;
        return getSwatch(
            findClosestBackgroundIndex(designSystem) -
                indexResolver(designSystem) * direction,
            neutralPalette(designSystem)
        );
    };
}

/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillInputRest_DEPRECATED: ColorRecipe<string> = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputRestDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillInputHover_DEPRECATED: ColorRecipe<string> = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputHoverDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillInputActive_DEPRECATED: ColorRecipe<string> = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputActiveDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillInputFocus_DEPRECATED: ColorRecipe<string> = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputFocusDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillInputSelected_DEPRECATED: ColorRecipe<string> = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputSelectedDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillInput_DEPRECATED: ColorRecipe<FillSwatchFamily> = colorRecipeFactory(
    (designSystem: FASTDesignSystem): FillSwatchFamily => {
        return {
            rest: neutralFillInputRest_DEPRECATED(designSystem),
            hover: neutralFillInputHover_DEPRECATED(designSystem),
            active: neutralFillInputActive_DEPRECATED(designSystem),
            focus: neutralFillInputFocus_DEPRECATED(designSystem),
            selected: neutralFillInputSelected_DEPRECATED(designSystem),
        };
    }
);
