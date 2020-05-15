import {
    neutralForegroundActiveDelta,
    neutralForegroundFocusDelta,
    neutralForegroundHoverDelta,
    neutralPalette,
} from "../fast-design-system.js";
import {
    colorRecipeFactory,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common.js";
import { accessibleAlgorithm } from "./accessible-recipe.js";

export const neutralForeground: SwatchFamilyResolver = colorRecipeFactory(
    accessibleAlgorithm(
        neutralPalette,
        14,
        0,
        neutralForegroundHoverDelta,
        neutralForegroundActiveDelta,
        neutralForegroundFocusDelta
    )
);

export const neutralForegroundRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    neutralForeground
);
export const neutralForegroundHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    neutralForeground
);
export const neutralForegroundActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    neutralForeground
);
export const neutralForegroundFocus: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.focus,
    neutralForeground
);
