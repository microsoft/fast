import { DesignSystemResolver } from "../fast-design-system";
import { neutralPalette } from "../fast-design-system";
import {
    colorRecipeFactory,
    SwatchFamily,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common";
import { accessibleAlgorithm } from "./accessible-recipe";

function neutralForegroundHintAlgorithm(
    targetContrast: number
): DesignSystemResolver<SwatchFamily> {
    return accessibleAlgorithm(neutralPalette, targetContrast, 0, 0, 0, 0);
}

/**
 * Hint text for normal sized text, less than 18pt normal weight
 * @internal
 */
export const neutralForegroundHint: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    colorRecipeFactory(neutralForegroundHintAlgorithm(4.5))
);

/**
 * Hint text for large sized text, greater than 18pt or 16pt and bold
 * @internal
 */
export const neutralForegroundHintLarge: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    colorRecipeFactory(neutralForegroundHintAlgorithm(3))
);
