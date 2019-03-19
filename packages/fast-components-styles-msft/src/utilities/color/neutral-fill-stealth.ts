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
    Swatch,
} from "./palette";
import {
    ColorRecipe,
    FillSwatch,
    StatefulSwatchToColorRecipeFactory,
    SwatchStates,
} from "./common";

/**
 * Algorithm for determining stealth fill colors
 */
const neutralFillStealthAlgorithm: DesignSystemResolver<FillSwatch> = (
    designSystem: DesignSystem
): FillSwatch => {
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

export function neutralFillStealth(designSystem: DesignSystem): FillSwatch;
export function neutralFillStealth(
    backgroundResolver: (designSystem: DesignSystem) => Swatch
): (designSystem: DesignSystem) => FillSwatch;
export function neutralFillStealth(arg: any): any {
    if (typeof arg === "function") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): FillSwatch => {
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

export const neutralFillStealthRest: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.rest, neutralFillStealth);
export const neutralFillStealthHover: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.hover, neutralFillStealth);
export const neutralFillStealthActive: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.active, neutralFillStealth);
export const neutralFillStealthSelected: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.selected, neutralFillStealth);
