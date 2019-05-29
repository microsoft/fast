import { DesignSystem, DesignSystemResolver } from "../../design-system";
import {
    neutralFillActiveDelta,
    neutralFillHoverDelta,
    neutralFillRestDelta,
    neutralFillSelectedDelta,
    neutralPalette,
} from "../design-system";
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
    neutralFillActiveDelta
);

enum FillType {
    rest = "rest",
    hover = "hover",
    active = "active",
    selected = "selected",
}

function neutralFillAlgorithm(
    deltaResolver: DesignSystemResolver<number>,
    fillType: FillType
): DesignSystemResolver<Swatch> {
    return (designSystem: DesignSystem): Swatch => {
        const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
        const swapThreshold: number = neutralFillThreshold(designSystem);

        const direction: 1 | -1 = backgroundIndex >= swapThreshold ? -1 : 1;

        const value: number = deltaResolver(designSystem);

        const restDelta: number = neutralFillRestDelta(designSystem);
        const restIndex: number = backgroundIndex + direction * restDelta;
        switch (fillType) {
            case FillType.rest:
                return getSwatch(restIndex, neutralPalette(designSystem));
            case FillType.hover:
                const hoverDelta: number = neutralFillHoverDelta(designSystem);
                const hoverIndex: number = restIndex + hoverDelta - restDelta;
                return getSwatch(hoverIndex, neutralPalette(designSystem));
            case FillType.active:
                const activeDelta: number = neutralFillActiveDelta(designSystem);
                const activeIndex: number = restIndex + activeDelta - restDelta;
                return getSwatch(activeIndex, neutralPalette(designSystem));
            case FillType.selected:
                const selectedIndex: number = backgroundIndex + direction * value;
                return getSwatch(selectedIndex, neutralPalette(designSystem));
        }
    };
}

export const neutralFill: ColorRecipe<FillSwatchFamily> = colorRecipeFactory(
    (designSystem: DesignSystem): FillSwatchFamily => {
        return {
            rest: neutralFillRest(designSystem),
            hover: neutralFillHover(designSystem),
            active: neutralFillActive(designSystem),
            selected: neutralFillSelected(designSystem),
        };
    }
);

export const neutralFillRest: SwatchRecipe = colorRecipeFactory(
    neutralFillAlgorithm(neutralFillRestDelta, FillType.rest)
);
export const neutralFillHover: SwatchRecipe = colorRecipeFactory(
    neutralFillAlgorithm(neutralFillHoverDelta, FillType.hover)
);
export const neutralFillActive: SwatchRecipe = colorRecipeFactory(
    neutralFillAlgorithm(neutralFillActiveDelta, FillType.active)
);
export const neutralFillSelected: SwatchRecipe = colorRecipeFactory(
    (designSystem: DesignSystem): Swatch => {
        return neutralFillAlgorithm(neutralFillSelectedDelta, FillType.selected)(
            designSystem
        );
    }
);
