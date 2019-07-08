import { DesignSystem } from "../../design-system";
import { neutralDividerRestDelta } from "../design-system";
import {
    findClosestBackgroundIndex,
    getSwatch,
    palette,
    Palette,
    PaletteType,
} from "./palette";
import { colorRecipeFactory, Swatch, SwatchRecipe, SwatchResolver } from "./common";

const neutralDividerAlgorithm: SwatchResolver = (designSystem: DesignSystem): Swatch => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
    const delta: number = neutralDividerRestDelta(designSystem);
    const swapThreshold: number = neutralPalette.length - delta;
    const direction: 1 | -1 = backgroundIndex >= swapThreshold ? -1 : 1;

    const index: number = backgroundIndex + direction * delta;
    return getSwatch(index, neutralPalette);
};

export const neutralDividerRest: SwatchRecipe = colorRecipeFactory<Swatch>(
    neutralDividerAlgorithm
);
