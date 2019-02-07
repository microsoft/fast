import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import { memoize } from "lodash-es";
import { findClosestSwatchIndex, palette, Palette, PaletteType, Swatch } from "./palette";
import {
    ColorRecipe,
    StatefulSwatch,
    StatefulSwatchToColorRecipeFactory,
    SwatchStates,
} from "./common";

/**
 * Deltas to derive state swatches from the background
 */
export const neutralFillDeltaRest: number = 4;
export const neutralFillDeltaHover: number = 3;
export const neutralFillDeltaActive: number = 2;

/**
 * The minimum offset before which we can switch backplate directions
 */
const swapThreshold: number = Math.max(
    neutralFillDeltaRest,
    neutralFillDeltaHover,
    neutralFillDeltaActive
);

/**
 * Algorithm for determining neutral backplate colors
 */
const neutralFillAlgorithm: DesignSystemResolver<StatefulSwatch> = memoize(
    (designSystem: DesignSystem): StatefulSwatch => {
        const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
        const backgroundIndex: number = findClosestSwatchIndex(
            PaletteType.neutral,
            designSystem.backgroundColor
        )(designSystem);
        const direction: number = backgroundIndex >= swapThreshold ? -1 : 1;

        return {
            rest: neutralPalette[backgroundIndex + direction * neutralFillDeltaRest],
            hover: neutralPalette[backgroundIndex + direction * neutralFillDeltaHover],
            active: neutralPalette[backgroundIndex + direction * neutralFillDeltaActive],
        };
    },
    (designSystem: DesignSystem): string => {
        return designSystem.backgroundColor;
    }
);

export function neutralFill(designSystem: DesignSystem): StatefulSwatch;
export function neutralFill(
    backgroundResolver: (designSystem: DesignSystem) => Swatch
): (designSystem: DesignSystem) => StatefulSwatch;
export function neutralFill(arg: any): any {
    if (typeof arg === "function") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): StatefulSwatch => {
                return neutralFillAlgorithm(
                    Object.assign({}, designSystem, {
                        backgroundColor: arg(designSystem),
                    })
                );
            }
        );
    } else {
        return neutralFillAlgorithm(withDesignSystemDefaults(arg));
    }
}

export const neutralFillRest: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.rest,
    neutralFill
);
export const neutralFillHover: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.hover,
    neutralFill
);
export const neutralFillActive: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.active,
    neutralFill
);
