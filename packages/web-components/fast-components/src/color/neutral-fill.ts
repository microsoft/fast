import { DesignSystemResolver, FASTDesignSystem } from "../fast-design-system";
import {
    neutralFillActiveDelta,
    neutralFillFocusDelta,
    neutralFillHoverDelta,
    neutralFillRestDelta,
    neutralFillSelectedDelta,
    neutralPalette,
} from "../fast-design-system";
import {
    ColorRecipe,
    colorRecipeFactory,
    designSystemResolverMax,
    FillSwatchFamily,
    Swatch,
    SwatchRecipe,
} from "./common";
import { findClosestBackgroundIndex, getSwatch } from "./palette";

const neutralFillThreshold: DesignSystemResolver<number> = designSystemResolverMax(
    neutralFillRestDelta,
    neutralFillHoverDelta,
    neutralFillActiveDelta,
    neutralFillFocusDelta
);

function neutralFillAlgorithm(
    deltaResolver: DesignSystemResolver<number>
): DesignSystemResolver<Swatch> {
    return (designSystem: FASTDesignSystem): Swatch => {
        const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
        const swapThreshold: number = neutralFillThreshold(designSystem);
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
export const neutralFillRest_DEPRECATED: SwatchRecipe = colorRecipeFactory(
    neutralFillAlgorithm(neutralFillRestDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillHover_DEPRECATED: SwatchRecipe = colorRecipeFactory(
    neutralFillAlgorithm(neutralFillHoverDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillActive_DEPRECATED: SwatchRecipe = colorRecipeFactory(
    neutralFillAlgorithm(neutralFillActiveDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillFocus_DEPRECATED: SwatchRecipe = colorRecipeFactory(
    neutralFillAlgorithm(neutralFillFocusDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFillSelected_DEPRECATED: SwatchRecipe = colorRecipeFactory(
    neutralFillAlgorithm(neutralFillSelectedDelta)
);
/**
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralFill_DEPRECATED: ColorRecipe<FillSwatchFamily> = colorRecipeFactory(
    (designSystem: FASTDesignSystem): FillSwatchFamily => {
        return {
            rest: neutralFillRest_DEPRECATED(designSystem),
            hover: neutralFillHover_DEPRECATED(designSystem),
            active: neutralFillActive_DEPRECATED(designSystem),
            focus: neutralFillFocus_DEPRECATED(designSystem),
            selected: neutralFillSelected_DEPRECATED(designSystem),
        };
    }
);
