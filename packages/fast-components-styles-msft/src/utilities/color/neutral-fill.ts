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
    neutralFillSelectedDelta,
} from "../design-system";

/**
 * Algorithm for determining neutral backplate colors
 */
const neutralFillAlgorithm: DesignSystemResolver<FillSwatchFamily> = (
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
        neutralFillActiveDelta(designSystem)
    );
    const direction: number = backgroundIndex >= swapThreshold ? -1 : 1;
    const restIndex: number =
        backgroundIndex + direction * neutralFillRestDelta(designSystem);

    return {
        rest: getSwatch(restIndex, neutralPalette),
        hover: getSwatch(
            backgroundIndex + direction * neutralFillHoverDelta(designSystem),
            neutralPalette
        ),
        active: getSwatch(
            backgroundIndex + direction * neutralFillActiveDelta(designSystem),
            neutralPalette
        ),
        selected: getSwatch(
            restIndex +
                (isDarkMode(designSystem)
                    ? neutralFillSelectedDelta(designSystem) * -1
                    : neutralFillSelectedDelta(designSystem)),
            neutralPalette
        ),
    };
};

export function neutralFill(designSystem: DesignSystem): FillSwatchFamily;
export function neutralFill(
    backgroundResolver: SwatchResolver
): (designSystem: DesignSystem) => FillSwatchFamily;
export function neutralFill(arg: any): any {
    if (typeof arg === "function") {
        return (designSystem: DesignSystem): FillSwatchFamily => {
            return neutralFillAlgorithm(
                Object.assign({}, designSystem, {
                    backgroundColor: arg(designSystem),
                })
            );
        };
    } else {
        return neutralFillAlgorithm(arg);
    }
}

export const neutralFillRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.rest, neutralFill);
export const neutralFillHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.hover, neutralFill);
export const neutralFillActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.active, neutralFill);
export const neutralFillSelected: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.selected, neutralFill);
