import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import { clamp } from "lodash-es";
import {
    findClosestSwatchIndex,
    getSwatch,
    isDarkTheme,
    palette,
    Palette,
    PaletteType,
    Swatch,
} from "./palette";
import {
    ColorRecipe,
    FillSwatch,
    StatefulSwatchToColorRecipeFactory,
    SwatchStates,
} from "./common";

/**
 * Deltas to derive state swatches from the background
 */
export const neutralFillDeltaRest: number = 4;
export const neutralFillDeltaHover: number = 3;
export const neutralFillDeltaActive: number = 2;
export const neutralFillDeltaSelected: number = 16;

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
const neutralFillAlgorithm: DesignSystemResolver<FillSwatch> = (
    designSystem: DesignSystem
): FillSwatch => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const backgroundIndex: number = findClosestSwatchIndex(
        PaletteType.neutral,
        designSystem.backgroundColor
    )(designSystem);
    const direction: number = backgroundIndex >= swapThreshold ? -1 : 1;
    const restIndex: number = backgroundIndex + direction * neutralFillDeltaRest;

    return {
        rest: getSwatch(restIndex, neutralPalette),
        hover: getSwatch(
            backgroundIndex + direction * neutralFillDeltaHover,
            neutralPalette
        ),
        active: getSwatch(
            backgroundIndex + direction * neutralFillDeltaActive,
            neutralPalette
        ),
        selected: getSwatch(
            restIndex +
                (isDarkTheme(designSystem)
                    ? neutralFillDeltaSelected * -1
                    : neutralFillDeltaSelected),
            neutralPalette
        ),
    };
};

export function neutralFill(designSystem: DesignSystem): FillSwatch;
export function neutralFill(
    backgroundResolver: (designSystem: DesignSystem) => Swatch
): (designSystem: DesignSystem) => FillSwatch;
export function neutralFill(arg: any): any {
    if (typeof arg === "function") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): FillSwatch => {
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

export const neutralFillRest: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.rest, neutralFill);
export const neutralFillHover: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.hover, neutralFill);
export const neutralFillActive: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.active, neutralFill);
export const neutralFillSelected: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.selected, neutralFill);
