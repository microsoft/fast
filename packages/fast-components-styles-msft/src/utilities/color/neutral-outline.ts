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
    Swatch,
    SwatchFamily,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
    ColorRecipe,
    colorRecipeFactory,
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

    return {
        rest: getSwatch(
            backgroundIndex + direction * neutralOutlineRestDelta(designSystem),
            neutralPalette
        ),
        hover: getSwatch(
            backgroundIndex + direction * neutralOutlineHoverDelta(designSystem),
            neutralPalette
        ),
        active: getSwatch(
            backgroundIndex + direction * neutralOutlineActiveDelta(designSystem),
            neutralPalette
        ),
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
