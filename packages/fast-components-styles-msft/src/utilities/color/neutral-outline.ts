import { DesignSystem } from "../../design-system";
import {
    findClosestSwatchIndex,
    getSwatch,
    isDarkMode,
    palette,
    Palette,
    PaletteType,
} from "./palette";
import {
    ColorRecipe,
    colorRecipeFactory,
    SwatchFamily,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common";
import {
    backgroundColor,
    neutralOutlineActiveDelta,
    neutralOutlineHoverDelta,
    neutralOutlineRestDelta,
} from "../design-system";

const neutralOutlineAlgorithm: SwatchFamilyResolver = (
    designSystem: DesignSystem
): SwatchFamily => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const backgroundIndex: number = findClosestSwatchIndex(
        PaletteType.neutral,
        backgroundColor(designSystem)
    )(designSystem);
    const direction: 1 | -1 = isDarkMode(designSystem) ? -1 : 1;

    const restDelta: number = neutralOutlineRestDelta(designSystem);
    const hoverDelta: number = neutralOutlineHoverDelta(designSystem);
    const activeDelta: number = neutralOutlineActiveDelta(designSystem);
    const restIndex: number = backgroundIndex + direction * restDelta;
    return {
        rest: getSwatch(restIndex, neutralPalette),
        hover: getSwatch(restIndex + hoverDelta - restDelta, neutralPalette),
        active: getSwatch(restIndex + activeDelta - restDelta, neutralPalette),
    };
};

export const neutralOutline: ColorRecipe<SwatchFamily> = colorRecipeFactory(
    neutralOutlineAlgorithm
);
export const neutralOutlineRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    neutralOutline
);
export const neutralOutlineHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    neutralOutline
);
export const neutralOutlineActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    neutralOutline
);
