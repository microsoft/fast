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
 * Algorithm for determining neutral backplate colors
 */
const neutralFillInputAlgorithm: DesignSystemResolver<FillSwatch> = (
    designSystem: DesignSystem
): FillSwatch => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const backgroundIndex: number = findClosestSwatchIndex(
        PaletteType.neutral,
        designSystem.backgroundColor
    )(designSystem);
    return {
        rest: getSwatch(
            backgroundIndex - designSystem.neutralFillInputRestDelta,
            neutralPalette
        ),
        hover: getSwatch(
            backgroundIndex - designSystem.neutralFillInputHoverDelta,
            neutralPalette
        ),
        active: getSwatch(
            backgroundIndex - designSystem.neutralFillInputActiveDelta,
            neutralPalette
        ),
        selected: getSwatch(
            backgroundIndex - designSystem.neutralFillInputSelectedDelta,
            neutralPalette
        ),
    };
};

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
