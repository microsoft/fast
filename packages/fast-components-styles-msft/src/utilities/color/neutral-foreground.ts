import { DesignSystem, DesignSystemResolver } from "../../design-system";
import {
    neutralForegroundActiveDelta,
    neutralForegroundDarkIndex,
    neutralForegroundHoverDelta,
    neutralForegroundLightIndex,
    neutralPalette,
} from "../design-system";
import {
    ColorRecipe,
    colorRecipeFactory,
    Swatch,
    SwatchFamily,
    SwatchRecipe,
    SwatchResolver,
} from "./common";
import { getSwatch, isDarkMode, Palette } from "./palette";

/**
 * Function to derive neutralForeground from color inputs.
 * Performs a simple contrast check against the colors and returns
 * the color that has the most contrast against the background. If contrast
 * cannot be retrieved correctly, function returns black.
 */
function neutralForegroundAlgorithm(
    deltaResolver: DesignSystemResolver<number>
): DesignSystemResolver<Swatch> {
    return (designSystem: DesignSystem): Swatch => {
        const palette: Palette = neutralPalette(designSystem);
        const isDark: boolean = isDarkMode(designSystem);
        const direction: 1 | -1 = isDark ? 1 : -1;
        const restColor: Swatch = isDark
            ? neutralForegroundLight(designSystem)
            : neutralForegroundDark(designSystem);
        const restIndex: number = palette.indexOf(restColor);
        return getSwatch(restIndex + deltaResolver(designSystem) * direction, palette);
    };
}

/**
 * Retrieve light neutral-foreground color for use on dark backgrounds
 */
export const neutralForegroundLight: SwatchResolver = (
    designSystem: DesignSystem
): Swatch => {
    return getSwatch(
        neutralForegroundLightIndex(designSystem),
        neutralPalette(designSystem)
    );
};

/**
 * Retrieve dark neutral-foreground color for use on light backgrounds
 */
export const neutralForegroundDark: SwatchResolver = (
    designSystem: DesignSystem
): Swatch => {
    return getSwatch(
        neutralForegroundDarkIndex(designSystem),
        neutralPalette(designSystem)
    );
};

export const neutralForeground: ColorRecipe<SwatchFamily> = colorRecipeFactory(
    (designSystem: DesignSystem): SwatchFamily => {
        return {
            rest: neutralForegroundRest(designSystem),
            hover: neutralForegroundHover(designSystem),
            active: neutralForegroundActive(designSystem),
        };
    }
);

export const neutralForegroundRest: SwatchRecipe = colorRecipeFactory(
    neutralForegroundAlgorithm(() => 0)
);
export const neutralForegroundHover: SwatchRecipe = colorRecipeFactory(
    neutralForegroundAlgorithm(neutralForegroundHoverDelta)
);
export const neutralForegroundActive: SwatchRecipe = colorRecipeFactory(
    neutralForegroundAlgorithm(neutralForegroundActiveDelta)
);
