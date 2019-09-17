import {
    neutralForegroundActiveDelta,
    neutralForegroundHoverDelta,
    neutralPalette,
} from "../design-system";
import {
    colorRecipeFactory,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common";
import { accessibleAlgorithm } from "./accessible-recipe";

export const neutralForeground: SwatchFamilyResolver = colorRecipeFactory(
    accessibleAlgorithm(
        neutralPalette,
        14,
        0,
        neutralForegroundHoverDelta,
        neutralForegroundActiveDelta
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
