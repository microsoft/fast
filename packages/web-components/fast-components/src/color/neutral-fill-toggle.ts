import {
    neutralFillToggleActiveDelta,
    neutralFillToggleFocusDelta,
    neutralFillToggleHoverDelta,
    neutralPalette,
} from "../fast-design-system";
import {
    colorRecipeFactory,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common";
import { accessibleAlgorithm } from "./accessible-recipe";

/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillToggle_DEPRECATED: SwatchFamilyResolver = colorRecipeFactory(
    accessibleAlgorithm(
        neutralPalette,
        4.5,
        0,
        neutralFillToggleHoverDelta,
        neutralFillToggleActiveDelta,
        neutralFillToggleFocusDelta
    )
);

/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillToggleRest_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    neutralFillToggle_DEPRECATED
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillToggleHover_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    neutralFillToggle_DEPRECATED
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillToggleActive_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    neutralFillToggle_DEPRECATED
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillToggleFocus_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.focus,
    neutralFillToggle_DEPRECATED
);
