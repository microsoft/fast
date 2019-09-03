import { DesignSystem, DesignSystemResolver } from "../../design-system";
import {
    neutralFillActiveDelta,
    neutralFillHoverDelta,
    neutralFillRestDelta,
    neutralFillStealthActiveDelta,
    neutralFillStealthHoverDelta,
    neutralFillStealthRestDelta,
    neutralFillStealthSelectedDelta,
    neutralPalette,
} from "../design-system";
import {
    ColorRecipe,
    colorRecipeFactory,
    designSystemResolverMax,
    FillSwatchFamily,
    Swatch,
} from "./common";
import { findClosestBackgroundIndex, getSwatch } from "./palette";

const neutralFillStealthSwapThreshold: DesignSystemResolver<
    number
> = designSystemResolverMax(
    neutralFillRestDelta,
    neutralFillHoverDelta,
    neutralFillActiveDelta,
    neutralFillStealthRestDelta,
    neutralFillStealthHoverDelta,
    neutralFillStealthActiveDelta
);

function neutralFillStealthAlgorithm(
    deltaResolver: DesignSystemResolver<number>
): DesignSystemResolver<Swatch> {
    return (designSystem: DesignSystem): Swatch => {
        const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
        const swapThreshold: number = neutralFillStealthSwapThreshold(designSystem);

        const direction: 1 | -1 = backgroundIndex >= swapThreshold ? -1 : 1;

        return getSwatch(
            backgroundIndex + direction * deltaResolver(designSystem),
            neutralPalette(designSystem)
        );
    };
}

export const neutralFillStealth: ColorRecipe<FillSwatchFamily> = colorRecipeFactory(
    (designSystem: DesignSystem) => {
        return {
            rest: neutralFillStealthRest(designSystem),
            hover: neutralFillStealthHover(designSystem),
            active: neutralFillStealthActive(designSystem),
            selected: neutralFillStealthSelected(designSystem),
        };
    }
);

export const neutralFillStealthRest: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFillStealthAlgorithm(neutralFillStealthRestDelta)
);
export const neutralFillStealthHover: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFillStealthAlgorithm(neutralFillStealthHoverDelta)
);
export const neutralFillStealthActive: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFillStealthAlgorithm(neutralFillStealthActiveDelta)
);
export const neutralFillStealthSelected: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFillStealthAlgorithm(neutralFillStealthSelectedDelta)
);
