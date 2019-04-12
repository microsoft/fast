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
    neutralFillActiveDelta,
    neutralFillHoverDelta,
    neutralFillRestDelta,
    neutralFillStealthActiveDelta,
    neutralFillStealthHoverDelta,
    neutralFillStealthRestDelta,
    neutralFillStealthSelectedDelta,
} from "../design-system";

/**
 * Algorithm for determining stealth fill colors
 */
const neutralFillStealthAlgorithm: DesignSystemResolver<FillSwatchFamily> = (
    designSystem: DesignSystem
): FillSwatchFamily => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const backgroundIndex: number = findClosestSwatchIndex(
        PaletteType.neutral,
        backgroundColor(designSystem)
    )(designSystem);
    const swapThreshold: number = Math.max(
        neutralFillRestDelta(designSystem),
        neutralFillHoverDelta(designSystem),
        neutralFillActiveDelta(designSystem),
        neutralFillStealthRestDelta(designSystem),
        neutralFillStealthHoverDelta(designSystem),
        neutralFillStealthActiveDelta(designSystem)
    );
    const direction: number = backgroundIndex >= swapThreshold ? -1 : 1;
    const restIndex: number =
        backgroundIndex + direction * neutralFillStealthRestDelta(designSystem);

    return {
        rest: getSwatch(restIndex, neutralPalette),
        hover: getSwatch(
            backgroundIndex + direction * neutralFillStealthHoverDelta(designSystem),
            neutralPalette
        ),
        active: getSwatch(
            backgroundIndex + direction * neutralFillStealthActiveDelta(designSystem),
            neutralPalette
        ),
        selected: getSwatch(
            restIndex +
                (isDarkMode(designSystem)
                    ? neutralFillStealthSelectedDelta(designSystem) * -1
                    : neutralFillStealthSelectedDelta(designSystem)),
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
        return (designSystem: DesignSystem): FillSwatchFamily => {
            return neutralFillStealthAlgorithm(
                Object.assign({}, designSystem, {
                    backgroundColor: arg(designSystem),
                })
            );
        };
    } else {
        return neutralFillStealthAlgorithm(arg);
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
