import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import {
    findClosestSwatchIndex,
    getSwatch,
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

/**
 * Algorithm for determining neutral backplate colors
 */
const neutralFillInputAlgorithm: DesignSystemResolver<FillSwatchFamily> = (
    designSystem: DesignSystem
): FillSwatchFamily => {
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

export function neutralFillInput(designSystem: DesignSystem): FillSwatchFamily;
export function neutralFillInput(
    backgroundResolver: SwatchResolver
): (designSystem: DesignSystem) => FillSwatchFamily;
export function neutralFillInput(arg: any): any {
    if (typeof arg === "function") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): FillSwatchFamily => {
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
