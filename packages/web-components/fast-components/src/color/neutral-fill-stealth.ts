import { DesignSystemResolver, FASTDesignSystem } from "../fast-design-system";
import {
    neutralFillActiveDelta,
    neutralFillFocusDelta,
    neutralFillHoverDelta,
    neutralFillRestDelta,
    neutralFillStealthActiveDelta,
    neutralFillStealthFocusDelta,
    neutralFillStealthHoverDelta,
    neutralFillStealthRestDelta,
    neutralFillStealthSelectedDelta,
    neutralPalette,
} from "../fast-design-system";
import {
    ColorRecipe,
    colorRecipeFactory,
    designSystemResolverMax,
    FillSwatchFamily,
    Swatch,
} from "./common";
import { findClosestBackgroundIndex, getSwatch } from "./palette";

const neutralFillStealthSwapThreshold: DesignSystemResolver<number> = designSystemResolverMax(
    neutralFillRestDelta,
    neutralFillHoverDelta,
    neutralFillActiveDelta,
    neutralFillFocusDelta,
    neutralFillStealthRestDelta,
    neutralFillStealthHoverDelta,
    neutralFillStealthActiveDelta,
    neutralFillStealthFocusDelta
);

function neutralFillStealthAlgorithm(
    deltaResolver: DesignSystemResolver<number>
): DesignSystemResolver<Swatch> {
    return (designSystem: FASTDesignSystem): Swatch => {
        const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
        const swapThreshold: number = neutralFillStealthSwapThreshold(designSystem);

        const direction: 1 | -1 = backgroundIndex >= swapThreshold ? -1 : 1;

        return getSwatch(
            backgroundIndex + direction * deltaResolver(designSystem),
            neutralPalette(designSystem)
        );
    };
}

/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillStealthRest_DEPRECATED: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFillStealthAlgorithm(neutralFillStealthRestDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillStealthHover_DEPRECATED: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFillStealthAlgorithm(neutralFillStealthHoverDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillStealthActive_DEPRECATED: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFillStealthAlgorithm(neutralFillStealthActiveDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillStealthFocus_DEPRECATED: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFillStealthAlgorithm(neutralFillStealthFocusDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillStealthSelected_DEPRECATED: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFillStealthAlgorithm(neutralFillStealthSelectedDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillStealth_DEPRECATED: ColorRecipe<FillSwatchFamily> = colorRecipeFactory(
    (designSystem: FASTDesignSystem) => {
        return {
            rest: neutralFillStealthRest_DEPRECATED(designSystem),
            hover: neutralFillStealthHover_DEPRECATED(designSystem),
            active: neutralFillStealthActive_DEPRECATED(designSystem),
            focus: neutralFillStealthFocus_DEPRECATED(designSystem),
            selected: neutralFillStealthSelected_DEPRECATED(designSystem),
        };
    }
);
