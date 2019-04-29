import { DesignSystem, DesignSystemResolver } from "../../design-system";
import {
    findClosestSwatchIndex,
    getSwatch,
    isDarkMode,
    palette,
    Palette,
    PaletteType,
} from "./palette";
import {
    FillSwatchFamily,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
    SwatchResolver,
} from "./common";
import {
    backgroundColor,
    neutralFillInputActiveDelta,
    neutralFillInputHoverDelta,
    neutralFillInputRestDelta,
    neutralFillInputSelectedDelta,
} from "../design-system";

/**
 * Algorithm for determining neutral backplate colors
 */
const neutralFillInputAlgorithm: DesignSystemResolver<FillSwatchFamily> = (
    designSystem: DesignSystem
): FillSwatchFamily => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const backgroundIndex: number = findClosestSwatchIndex(
        PaletteType.neutral,
        backgroundColor(designSystem)
    )(designSystem);
    const direction: 1 | -1 = isDarkMode(designSystem) ? -1 : 1;

    return {
        rest: getSwatch(
            backgroundIndex - neutralFillInputRestDelta(designSystem) * direction,
            neutralPalette
        ),
        hover: getSwatch(
            backgroundIndex - neutralFillInputHoverDelta(designSystem) * direction,
            neutralPalette
        ),
        active: getSwatch(
            backgroundIndex - neutralFillInputActiveDelta(designSystem) * direction,
            neutralPalette
        ),
        selected: getSwatch(
            backgroundIndex - neutralFillInputSelectedDelta(designSystem) * direction,
            neutralPalette
        ),
    };
};

export function neutralFillInput(designSystem: DesignSystem): FillSwatchFamily;
export function neutralFillInput(
    backgroundResolver: SwatchResolver
): (designSystem: DesignSystem) => FillSwatchFamily;
export function neutralFillInput(arg: any): any {
    if (typeof arg === "function") {
        return (designSystem: DesignSystem): FillSwatchFamily => {
            return neutralFillInputAlgorithm(
                Object.assign({}, designSystem, {
                    backgroundColor: arg(designSystem),
                })
            );
        };
    }

    return neutralFillInputAlgorithm(arg);
}

export const neutralFillInputRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.rest, neutralFillInput);
export const neutralFillInputHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.hover, neutralFillInput);
export const neutralFillInputActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.active, neutralFillInput);
export const neutralFillInputSelected: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.selected, neutralFillInput);
