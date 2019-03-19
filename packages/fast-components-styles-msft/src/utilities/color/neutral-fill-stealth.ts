import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import {
    findClosestSwatchIndex,
    getSwatch,
    isDarkTheme,
    palette,
    Palette,
    PaletteType,
} from "./palette";
import {
    FillSwatchFamily,
    Swatch,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
    SwatchResolver,
} from "./common";

/**
 * Algorithm for determining stealth fill colors
 */
const neutralFillStealthAlgorithm: DesignSystemResolver<FillSwatchFamily> = (
    designSystem: DesignSystem
): FillSwatchFamily => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const backgroundIndex: number = findClosestSwatchIndex(
        PaletteType.neutral,
        designSystem.backgroundColor
    )(designSystem);
    const swapThreshold: number = Math.max(
        designSystem.neutralFillRestDelta,
        designSystem.neutralFillHoverDelta,
        designSystem.neutralFillActiveDelta,
        designSystem.neutralFillStealthRestDelta,
        designSystem.neutralFillStealthHoverDelta,
        designSystem.neutralFillStealthActiveDelta
    );
    const direction: number = backgroundIndex >= swapThreshold ? -1 : 1;
    const restIndex: number =
        backgroundIndex + direction * designSystem.neutralFillStealthRestDelta;

    return {
        rest: getSwatch(restIndex, neutralPalette),
        hover: getSwatch(
            backgroundIndex + direction * designSystem.neutralFillStealthHoverDelta,
            neutralPalette
        ),
        active: getSwatch(
            backgroundIndex + direction * designSystem.neutralFillStealthActiveDelta,
            neutralPalette
        ),
        selected: getSwatch(
            restIndex +
                (isDarkTheme(designSystem)
                    ? designSystem.neutralFillStealthActiveDelta * -1
                    : designSystem.neutralFillStealthActiveDelta),
            neutralPalette
        ),
    };
};

export function neutralFillStealth(designSystem: DesignSystem): FillSwatchFamily;
export function neutralFillStealth(
    backgroundResolver: SwatchResolver
): (designSystem: DesignSystem) => FillSwatchFamily;
export function neutralFillStealth(arg: any): any {
    if (typeof arg === "function") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): FillSwatchFamily => {
                return neutralFillStealthAlgorithm(
                    Object.assign({}, designSystem, {
                        backgroundColor: arg(designSystem),
                    })
                );
            }
        );
    } else {
        return neutralFillStealthAlgorithm(withDesignSystemDefaults(arg));
    }
}

export const neutralFillStealthRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.rest, neutralFillStealth);
export const neutralFillStealthHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.hover, neutralFillStealth);
export const neutralFillStealthActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.active, neutralFillStealth);
export const neutralFillStealthSelected: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.selected, neutralFillStealth);
