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

enum FillType {
    rest = "rest",
    hover = "hover",
    active = "active",
    selected = "selected",
}

function neutralFillStealthAlogrithm(
    deltaResolver: DesignSystemResolver<number>,
    fillType: FillType
): DesignSystemResolver<Swatch> {
    return (designSystem: DesignSystem): Swatch => {
        const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
        const swapThreshold: number = neutralFillStealthSwapThreshold(designSystem);

        const direction: 1 | -1 = backgroundIndex >= swapThreshold ? -1 : 1;

        const value: number = deltaResolver(designSystem);

        const restDelta: number = neutralFillStealthRestDelta(designSystem);
        const restIndex: number = backgroundIndex + direction * restDelta;
        const restDeltaSymbolic: number =
            restDelta === 0 ? neutralFillRestDelta(designSystem) : restDelta;
        const restIndexSymbolic: number =
            backgroundIndex + direction * neutralFillRestDelta(designSystem);
        switch (fillType) {
            case FillType.rest:
                return getSwatch(restIndex, neutralPalette(designSystem));
            case FillType.hover:
                const hoverDelta: number = neutralFillStealthHoverDelta(designSystem);
                const hoverIndex: number =
                    restIndexSymbolic + hoverDelta - restDeltaSymbolic;
                return getSwatch(hoverIndex, neutralPalette(designSystem));
            case FillType.active:
                const activeDelta: number = neutralFillStealthActiveDelta(designSystem);
                const activeIndex: number =
                    restIndexSymbolic + activeDelta - restDeltaSymbolic;
                return getSwatch(activeIndex, neutralPalette(designSystem));
            case FillType.selected:
                const selectedIndex: number = backgroundIndex + direction * value;
                return getSwatch(selectedIndex, neutralPalette(designSystem));
        }
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
    neutralFillStealthAlogrithm(neutralFillStealthRestDelta, FillType.rest)
);
export const neutralFillStealthHover: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFillStealthAlogrithm(neutralFillStealthHoverDelta, FillType.hover)
);
export const neutralFillStealthActive: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFillStealthAlogrithm(neutralFillStealthActiveDelta, FillType.active)
);
export const neutralFillStealthSelected: ColorRecipe<Swatch> = colorRecipeFactory(
    (designSystem: DesignSystem): Swatch => {
        return neutralFillStealthAlogrithm(
            neutralFillStealthSelectedDelta,
            FillType.selected
        )(designSystem);
    }
);
