import { DesignSystem, DesignSystemResolver } from "../../design-system";
import {
    backgroundColor,
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
import {
    findClosestBackgroundIndex,
    getSwatch,
    isDarkMode,
    PaletteType,
} from "./palette";

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

function neutralFillStealthAlogrithm(
    deltaResolver: DesignSystemResolver<number>
): DesignSystemResolver<Swatch> {
    return (designSystem: DesignSystem): Swatch => {
        const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
        const direction: 1 | -1 =
            backgroundIndex >= neutralFillStealthSwapThreshold(designSystem) ? -1 : 1;

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
    neutralFillStealthAlogrithm(neutralFillStealthRestDelta)
);
export const neutralFillStealthHover: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFillStealthAlogrithm(neutralFillStealthHoverDelta)
);
export const neutralFillStealthActive: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFillStealthAlogrithm(neutralFillStealthActiveDelta)
);
export const neutralFillStealthSelected: ColorRecipe<Swatch> = colorRecipeFactory(
    (designSystem: DesignSystem): Swatch => {
        const delta: number = neutralFillStealthSelectedDelta(designSystem);

        return getSwatch(
            neutralPalette(designSystem).indexOf(neutralFillStealthRest(designSystem)) +
                (isDarkMode(designSystem) ? delta * -1 : delta),
            neutralPalette(designSystem)
        );
    }
);
