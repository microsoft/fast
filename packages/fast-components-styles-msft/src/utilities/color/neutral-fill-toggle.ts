import {
    neutralFillToggleActiveDelta,
    neutralFillToggleHoverDelta,
    neutralFillToggleRestContrast,
    neutralPalette,
} from "../design-system";
import {
    colorRecipeFactory,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common";
import { accessibleAlgorithm } from "./recipe";

export const neutralFillToggle: SwatchFamilyResolver = colorRecipeFactory(
    accessibleAlgorithm(
        neutralPalette,
        neutralFillToggleRestContrast,
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
