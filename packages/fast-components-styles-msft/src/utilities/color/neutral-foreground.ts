import { getSwatch, isDarkMode, palette, Palette, PaletteType } from "./palette";
import {
    Swatch,
    SwatchFamily,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
    SwatchResolver,
} from "./common";
import defaultDesignSystem, { DesignSystem } from "../../design-system";
import {
    neutralForegroundActiveDelta,
    neutralForegroundDarkIndex,
    neutralForegroundHoverDelta,
    neutralForegroundLightIndex,
} from "../design-system";

/**
 * Function to derive neutralForeground from color inputs.
 * Performs a simple contrast check against the colors and returns
 * the color that has the most contrast against the background. If contrast
 * cannot be retrieved correctly, function returns black.
 */
const neutralForegroundAlgorithm: SwatchFamilyResolver = (
    designSystem: DesignSystem
): SwatchFamily => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const isDark: boolean = isDarkMode(designSystem);
    const direction: 1 | -1 = isDark ? 1 : -1;
    const restColor: Swatch = isDark
        ? neutralForegroundLight(designSystem)
        : neutralForegroundDark(designSystem);
    const restIndex: number = neutralPalette.indexOf(restColor);
    const hoverIndex: number =
        restIndex + neutralForegroundHoverDelta(designSystem) * direction;
    const activeIndex: number =
        restIndex + neutralForegroundActiveDelta(designSystem) * direction;

    return {
        rest: restColor,
        hover: getSwatch(hoverIndex, neutralPalette),
        active: getSwatch(activeIndex, neutralPalette),
    };
};

/**
 * Retrieve light neutral-foreground color for use on dark backgrounds
 */
export const neutralForegroundLight: SwatchResolver = (
    designSystem: DesignSystem
): Swatch => {
    return getSwatch(
        neutralForegroundLightIndex(designSystem),
        palette(PaletteType.neutral)(designSystem)
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
        palette(PaletteType.neutral)(designSystem)
    );
};

export function neutralForeground(designSystem: DesignSystem): SwatchFamily;
export function neutralForeground(
    backgroundResolver: SwatchResolver
): (designSystem: DesignSystem) => SwatchFamily;
export function neutralForeground(arg: any): any {
    if (typeof arg === "function") {
        return (designSystem: DesignSystem): SwatchFamily => {
            const backgroundColor: Swatch = arg(designSystem);
            return neutralForegroundAlgorithm(
                Object.assign({}, designSystem, {
                    backgroundColor,
                })
            );
        };
    } else {
        return neutralForegroundAlgorithm(arg);
    }
}

export const neutralForegroundRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    neutralForeground
);
export const neutralForegroundHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    neutralForeground
);
export const neutralForegroundActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    neutralForeground
);
