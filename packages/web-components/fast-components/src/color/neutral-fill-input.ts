import { DesignSystemResolver, FASTDesignSystem } from "../fast-design-system.js";
import {
    neutralFillInputActiveDelta,
    neutralFillInputFocusDelta,
    neutralFillInputHoverDelta,
    neutralFillInputRestDelta,
    neutralFillInputSelectedDelta,
    neutralPalette,
} from "../fast-design-system.js";
import { findClosestBackgroundIndex, getSwatch, isDarkMode } from "./palette.js";
import {
    ColorRecipe,
    colorRecipeFactory,
    FillSwatchFamily,
    Swatch,
    SwatchRecipe,
} from "./common.js";

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

export const neutralFillInputRest: SwatchRecipe = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputRestDelta)
);
export const neutralFillInputHover: SwatchRecipe = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputHoverDelta)
);
export const neutralFillInputActive: SwatchRecipe = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputActiveDelta)
);
export const neutralFillInputFocus: SwatchRecipe = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputFocusDelta)
);
export const neutralFillInputSelected: SwatchRecipe = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputSelectedDelta)
);

export const neutralFillInput: ColorRecipe<FillSwatchFamily> = colorRecipeFactory(
    (designSystem: FASTDesignSystem): FillSwatchFamily => {
        return {
            rest: neutralFillInputRest(designSystem),
            hover: neutralFillInputHover(designSystem),
            active: neutralFillInputActive(designSystem),
            focus: neutralFillInputFocus(designSystem),
            selected: neutralFillInputSelected(designSystem),
        };
    }
);
