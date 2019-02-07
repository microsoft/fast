import { memoize } from "lodash-es";
import { isDarkTheme, palette, PaletteType, Swatch } from "./palette";
import { SwatchResolver } from "./common";
import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";

/**
 * Function to derive neutralForeground from color inputs.
 * Performs a simple contrast check against the colors and returns
 * the color that has the most contrast against the background. If contrast
 * cannot be retrieved correctly, function returns black.
 */
const neutralForegroundAlgorithm: SwatchResolver = memoize(
    (designSystem: DesignSystem): Swatch => {
        return isDarkTheme(designSystem)
            ? neutralForegroundLight(designSystem)
            : neutralForegroundDark(designSystem);
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

export function neutralForeground(designSystem: DesignSystem): Swatch;
export function neutralForeground(
    backgroundResolver: (designSystem: DesignSystem) => Swatch
): (designSystem: DesignSystem) => Swatch;
export function neutralForeground(arg: any): any {
    if (typeof arg === "function") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): Swatch => {
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
