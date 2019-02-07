import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "./design-system";
import { memoize } from "lodash";
import { palette, Palette, Swatch, findClosestSwatchIndex, Palettes } from "./palette";
import {
    StatefulSwatch,
    ColorRecipe,
    StatefulSwatchToColorRecipeFactory,
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
const neutralFillAlgorithm = memoize(
    (designSystem: DesignSystem): StatefulSwatch => {
        const neutralPalette: Palette = palette(Palettes.neutral)(designSystem);
        const backgroundIndex: number = findClosestSwatchIndex(
            Palettes.neutral,
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
    "rest",
    neutralFill
);
export const neutralFillHover: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "hover",
    neutralFill
);
export const neutralFillActive: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "active",
    neutralFill
);
