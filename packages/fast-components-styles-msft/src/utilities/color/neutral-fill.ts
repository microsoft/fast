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
import { findClosestBackgroundIndex, getSwatch, isDarkMode } from "./palette";

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

////////////////////
// Any portion of the code referencing newRecipeOffset is considered experimental
// and will be incorporated permanently or removed upon review. DO NOT use values
// in this range unless you are temporarily evaluation this feature as they will
// no longer produce predictable results once removed.
////////////////////
const newRecipeOffset: number = 100;

function neutralFillAlgorithm(
    deltaResolver: DesignSystemResolver<number>,
    fillType: FillType
): DesignSystemResolver<Swatch> {
    return (designSystem: DesignSystem): Swatch => {
        const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
        let swapThreshold: number = neutralFillThreshold(designSystem);

        if (swapThreshold >= newRecipeOffset) {
            swapThreshold -= newRecipeOffset;
        }

        const direction: 1 | -1 = backgroundIndex >= swapThreshold ? -1 : 1;

        const value: number = deltaResolver(designSystem);

        if (value >= newRecipeOffset) {
            const restDelta: number =
                neutralFillRestDelta(designSystem) - newRecipeOffset;
            const restIndex: number = backgroundIndex + direction * restDelta;
            switch (fillType) {
                case FillType.rest:
                    return getSwatch(restIndex, neutralPalette(designSystem));
                case FillType.hover:
                    const hoverDelta: number =
                        neutralFillHoverDelta(designSystem) - newRecipeOffset;
                    const hoverIndex: number = restIndex + hoverDelta - restDelta;
                    return getSwatch(hoverIndex, neutralPalette(designSystem));
                case FillType.active:
                    const activeDelta: number =
                        neutralFillActiveDelta(designSystem) - newRecipeOffset;
                    const activeIndex: number = restIndex + activeDelta - restDelta;
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
        const delta: number = neutralFillSelectedDelta(designSystem);

        if (delta >= newRecipeOffset) {
            return neutralFillAlgorithm(neutralFillSelectedDelta, FillType.selected)(
                designSystem
            );
        }

        return getSwatch(
            neutralPalette(designSystem).indexOf(neutralFillRest(designSystem)) +
                (isDarkMode(designSystem) ? delta * -1 : delta),
            neutralPalette(designSystem)
        );
    }
);
