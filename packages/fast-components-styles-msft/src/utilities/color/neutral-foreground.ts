import { memoize } from "lodash-es";
import { isDarkTheme, palette, Palette, PaletteType, Swatch } from "./palette";
import {
    ColorRecipe,
    StatefulSwatch,
    StatefulSwatchToColorRecipeFactory,
    SwatchResolver,
    SwatchStates,
} from "./common";
import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";

export const neutralForegroundDeltaHover: number = 8;
export const neutralForegroundDeltaActive: number = 16;

/**
 * Function to derive neutralForeground from color inputs.
 * Performs a simple contrast check against the colors and returns
 * the color that has the most contrast against the background. If contrast
 * cannot be retrieved correctly, function returns black.
 */
const neutralForegroundAlgorithm: (
    designSystem: DesignSystem
) => StatefulSwatch = memoize(
    (designSystem: DesignSystem): StatefulSwatch => {
        const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
        const isDark: boolean = isDarkTheme(designSystem);
        const direction: 1 | -1 = isDark ? 1 : -1;
        const restColor: Swatch = isDark
            ? neutralForegroundLight(designSystem)
            : neutralForegroundDark(designSystem);
        const restIndex: number = neutralPalette.indexOf(restColor);
        const hoverIndex: number = restIndex + neutralForegroundDeltaHover * direction;
        const activeIndex: number = restIndex + neutralForegroundDeltaActive * direction;

        return {
            rest: neutralPalette[restIndex],
            hover: neutralPalette[hoverIndex],
            active: neutralPalette[activeIndex],
        };
    },
    (designSystem: DesignSystem): string => {
        return designSystem.backgroundColor;
    }
);

/**
 * Retrieve light neutral-foreground color for use on dark backgrounds
 */
export function neutralForegroundLight(designSystem: DesignSystem): Swatch {
    return palette(PaletteType.neutral)(designSystem)[0];
}

/**
 * Retrieve dark neutral-foreground color for use on light backgrounds
 */
export function neutralForegroundDark(designSystem: DesignSystem): Swatch {
    return palette(PaletteType.neutral)(designSystem)[58];
}

export function neutralForeground(designSystem: DesignSystem): StatefulSwatch;
export function neutralForeground(
    backgroundResolver: SwatchResolver
): (designSystem: DesignSystem) => StatefulSwatch;
export function neutralForeground(arg: any): any {
    if (typeof arg === "function") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): StatefulSwatch => {
                const backgroundColor: Swatch = arg(designSystem);
                return neutralForegroundAlgorithm(
                    Object.assign({}, designSystem, {
                        backgroundColor,
                    })
                );
            }
        );
    } else {
        return neutralForegroundAlgorithm(withDesignSystemDefaults(arg));
    }
}

export const neutralForegroundRest: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.rest,
    neutralForeground
);
export const neutralForegroundHover: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.hover,
    neutralForeground
);
export const neutralForegroundActive: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.active,
    neutralForeground
);
