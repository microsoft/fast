import {
    neutralForegroundActiveDelta,
    neutralForegroundFocusDelta,
    neutralForegroundHoverDelta,
    neutralPalette,
} from "../fast-design-system";
import { accessibleAlgorithm } from "./accessible-recipe";
import {
    colorRecipeFactory,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common";

/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralForeground_DEPRECATED: SwatchFamilyResolver = colorRecipeFactory(
    accessibleAlgorithm(
        neutralPalette,
        14,
        0,
        neutralForegroundHoverDelta,
        neutralForegroundActiveDelta,
        neutralForegroundFocusDelta
    )
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralForegroundRest_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    neutralForeground_DEPRECATED
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralForegroundHover_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    neutralForeground_DEPRECATED
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralForegroundActive_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    neutralForeground_DEPRECATED
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralForegroundFocus_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.focus,
    neutralForeground_DEPRECATED
);
