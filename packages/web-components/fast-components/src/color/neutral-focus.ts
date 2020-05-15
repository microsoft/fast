import { DesignSystemResolver, FASTDesignSystem } from "../fast-design-system.js";
import { accentPalette, backgroundColor, neutralPalette } from "../fast-design-system.js";
import {
    findClosestSwatchIndex,
    isDarkMode,
    Palette,
    swatchByContrast,
} from "./palette.js";
import { ColorRecipe, colorRecipeFactory, Swatch, SwatchResolver } from "./common.js";

const targetRatio: number = 3.5;

function neutralFocusIndexResolver(
    referenceColor: string,
    palette: Palette,
    designSystem: FASTDesignSystem
): number {
    return findClosestSwatchIndex(neutralPalette, referenceColor)(designSystem);
}

function neutralFocusDirectionResolver(
    index: number,
    palette: Palette,
    designSystem: FASTDesignSystem
): 1 | -1 {
    return isDarkMode(designSystem) ? -1 : 1;
}

function neutralFocusContrastCondition(contrastRatio: number): boolean {
    return contrastRatio > targetRatio;
}

const neutralFocusAlgorithm: SwatchResolver = swatchByContrast(backgroundColor)(
    neutralPalette
)(neutralFocusIndexResolver)(neutralFocusDirectionResolver)(
    neutralFocusContrastCondition
);

export const neutralFocus: ColorRecipe<Swatch> = colorRecipeFactory(
    neutralFocusAlgorithm
);

function neutralFocusInnerAccentIndexResolver(
    accentFillColor: DesignSystemResolver<string>
): (
    referenceColor: string,
    sourcePalette: Palette,
    designSystem: FASTDesignSystem
) => number {
    return (
        referenceColor: string,
        sourcePalette: Palette,
        designSystem: FASTDesignSystem
    ): number => {
        return sourcePalette.indexOf(accentFillColor(designSystem));
    };
}

function neutralFocusInnerAccentDirectionResolver(
    referenceIndex: number,
    palette: string[],
    designSystem: FASTDesignSystem
): 1 | -1 {
    return isDarkMode(designSystem) ? 1 : -1;
}

export function neutralFocusInnerAccent(
    accentFillColor: DesignSystemResolver<string>
): DesignSystemResolver<string> {
    return swatchByContrast(neutralFocus)(accentPalette)(
        neutralFocusInnerAccentIndexResolver(accentFillColor)
    )(neutralFocusInnerAccentDirectionResolver)(neutralFocusContrastCondition);
}
