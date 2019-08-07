import { DesignSystem } from "../../design-system";
import { neutralDividerRestDelta, neutralPalette } from "../design-system";
import { findClosestBackgroundIndex, getSwatch, Palette } from "./palette";
import { colorRecipeFactory, Swatch, SwatchRecipe, SwatchResolver } from "./common";

const neutralDividerAlgorithm: SwatchResolver = (designSystem: DesignSystem): Swatch => {
    const palette: Palette = neutralPalette(designSystem);
    const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
    const delta: number = neutralDividerRestDelta(designSystem);
    const swapThreshold: number = palette.length - delta;
    const direction: 1 | -1 = backgroundIndex >= swapThreshold ? -1 : 1;

    const index: number = backgroundIndex + direction * delta;
    return getSwatch(index, palette);
};

export const neutralDividerRest: SwatchRecipe = colorRecipeFactory<Swatch>(
    neutralDividerAlgorithm
);
