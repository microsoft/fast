import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import { clamp, memoize } from "lodash-es";
import {
    findClosestSwatchIndex,
    getPaletteIndex,
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
 * All states have the same delta.
 */
export const neutralFillInputDelta: number = 4;

/**
 * Algorithm for determining neutral backplate colors
 */
const neutralFillInputAlgorithm: DesignSystemResolver<FillSwatch> = memoize(
    (designSystem: DesignSystem): FillSwatch => {
        const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
        const backgroundIndex: number = findClosestSwatchIndex(
            PaletteType.neutral,
            designSystem.backgroundColor
        )(designSystem);
        const color: Swatch = getPaletteIndex(
            backgroundIndex - neutralFillInputDelta,
            neutralPalette
        );

        return {
            rest: color,
            hover: color,
            active: color,
            selected: color,
        };
    },
    (designSystem: DesignSystem): string => {
        return designSystem.backgroundColor;
    }
);

export function neutralFillInput(designSystem: DesignSystem): FillSwatch;
export function neutralFillInput(
    backgroundResolver: (designSystem: DesignSystem) => Swatch
): (designSystem: DesignSystem) => FillSwatch;
export function neutralFillInput(arg: any): any {
    if (typeof arg === "function") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): FillSwatch => {
                return neutralFillInputAlgorithm(
                    Object.assign({}, designSystem, {
                        backgroundColor: arg(designSystem),
                    })
                );
            }
        );
    }

    return neutralFillInputAlgorithm(withDesignSystemDefaults(arg));
}

export const neutralFillInputRest: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.rest, neutralFillInput);
export const neutralFillInputHover: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.hover, neutralFillInput);
export const neutralFillInputActive: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.active, neutralFillInput);
export const neutralFillInputSelected: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.selected, neutralFillInput);
