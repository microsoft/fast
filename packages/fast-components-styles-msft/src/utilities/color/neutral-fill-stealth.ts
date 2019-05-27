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

enum FillType {
    rest = "rest",
    hover = "hover",
    active = "active",
    selected = "selected",
}

////////////////////
// Any portion of the code referencing newRecipeOffset is considered experimental
// and will be incorporated permanently or removed upon review. DO NOT use values
// in this range unless you are temporarily evaluation this feature as they will
// no longer produce predictable results once removed.
////////////////////
const newRecipeOffset: number = 100;

function neutralFillStealthAlogrithm(
    deltaResolver: DesignSystemResolver<number>,
    fillType: FillType
): DesignSystemResolver<Swatch> {
    return (designSystem: DesignSystem): Swatch => {
        const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
        let swapThreshold: number = neutralFillStealthSwapThreshold(designSystem);

        if (swapThreshold >= newRecipeOffset) {
            swapThreshold -= newRecipeOffset;
        }

        const direction: 1 | -1 = backgroundIndex >= swapThreshold ? -1 : 1;

        const value: number = deltaResolver(designSystem);

        if (value >= newRecipeOffset) {
            const restDelta: number =
                neutralFillStealthRestDelta(designSystem) - newRecipeOffset;
            const restIndex: number = backgroundIndex + direction * restDelta;
            const restDeltaSymbolic: number =
                restDelta === 0
                    ? neutralFillRestDelta(designSystem) - newRecipeOffset
                    : restDelta;
            const restIndexSymbolic: number =
                backgroundIndex +
                direction * (neutralFillRestDelta(designSystem) - newRecipeOffset);
            switch (fillType) {
                case FillType.rest:
                    return getSwatch(restIndex, neutralPalette(designSystem));
                case FillType.hover:
                    const hoverDelta: number =
                        neutralFillStealthHoverDelta(designSystem) - newRecipeOffset;
                    const hoverIndex: number =
                        restIndexSymbolic + hoverDelta - restDeltaSymbolic;
                    return getSwatch(hoverIndex, neutralPalette(designSystem));
                case FillType.active:
                    const activeDelta: number =
                        neutralFillStealthActiveDelta(designSystem) - newRecipeOffset;
                    const activeIndex: number =
                        restIndexSymbolic + activeDelta - restDeltaSymbolic;
                    return getSwatch(activeIndex, neutralPalette(designSystem));
                case FillType.selected:
                    const selectedIndex: number =
                        backgroundIndex + direction * (value - newRecipeOffset);
                    return getSwatch(selectedIndex, neutralPalette(designSystem));
            }
        }

        return getSwatch(
            backgroundIndex + direction * value,
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
        const delta: number = neutralFillStealthSelectedDelta(designSystem);

        if (delta >= newRecipeOffset) {
            return neutralFillStealthAlogrithm(
                neutralFillStealthSelectedDelta,
                FillType.selected
            )(designSystem);
        }

        return getSwatch(
            neutralPalette(designSystem).indexOf(neutralFillStealthRest(designSystem)) +
                (isDarkMode(designSystem) ? delta * -1 : delta),
            neutralPalette(designSystem)
        );
    }
);
