import { FASTDesignSystem } from "../fast-design-system.js";
import { neutralDividerRestDelta, neutralPalette } from "../fast-design-system.js";
import { findClosestBackgroundIndex, getSwatch, isDarkMode, Palette } from "./palette.js";
import { colorRecipeFactory, Swatch, SwatchRecipe, SwatchResolver } from "./common.js";

const neutralDividerAlgorithm: SwatchResolver = (
    designSystem: FASTDesignSystem
): Swatch => {
    const palette: Palette = neutralPalette(designSystem);
    const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
    const delta: number = neutralDividerRestDelta(designSystem);
    const direction: 1 | -1 = isDarkMode(designSystem) ? -1 : 1;

    const index: number = backgroundIndex + direction * delta;
    return getSwatch(index, palette);
};

export const neutralDividerRest: SwatchRecipe = colorRecipeFactory<Swatch>(
    neutralDividerAlgorithm
);
