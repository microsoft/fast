import {
    neutralContrastFillActiveDelta,
    neutralContrastFillFocusDelta,
    neutralContrastFillHoverDelta,
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
export const neutralContrastFill_DEPRECATED: SwatchFamilyResolver = colorRecipeFactory(
    accessibleAlgorithm(
        neutralPalette,
        14,
        0,
        neutralContrastFillHoverDelta,
        neutralContrastFillActiveDelta,
        neutralContrastFillFocusDelta
    )
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralContrastFillRest_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    neutralContrastFill_DEPRECATED
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralContrastFillHover_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    neutralContrastFill_DEPRECATED
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralContrastFillActive_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    neutralContrastFill_DEPRECATED
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralContrastFillFocus_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.focus,
    neutralContrastFill_DEPRECATED
);
