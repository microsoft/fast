import {
    neutralFillToggleActiveDelta,
    neutralFillToggleHoverDelta,
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

export const neutralFillToggle: SwatchFamilyResolver = colorRecipeFactory(
    accessibleAlgorithm(
        neutralPalette,
        4.5,
        0,
        neutralFillToggleHoverDelta,
        neutralFillToggleActiveDelta
    )
);

export const neutralFillToggleRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    neutralFillToggle
);
export const neutralFillToggleHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    neutralFillToggle
);
export const neutralFillToggleActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    neutralFillToggle
);
