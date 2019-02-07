import { neutralPaletteSource } from "./color-constants";
import { DesignSystem, ensureDesignSystemDefaults } from "./design-system";
import chroma from "chroma-js";
import { memoize } from "lodash"; // TODO: lodash-es throws in jest
import { isValidColor, colorMatches, luminance } from "./common";
import { neutralForegroundLight, neutralForegroundDark } from "./neutral-foreground";

/**
 * The named palettes of the MSFT design system
 */
export enum Palettes {
    neutral = "neutral",
    accent = "accent",
}

/**
 * Describes the format of a single color in a palette
 */
export type Swatch = string;
/**
 * The structure of a color palette
 */
export type Palette = Swatch[];

const generatePalette: (source: string[]) => Palette = memoize(
    (source: string[]): Palette => {
        const isValid: boolean = source.every(isValidColor);
        const sanitizedSource: string[] = isValid ? source : neutralPaletteSource;

        return chroma
            .scale(sanitizedSource)
            .mode("rgb")
            .colors(63) // TODO: can this value be dynamic?
            .map((color: string) => color.toUpperCase());
    },
    (source: string[]): string => {
        return Array.isArray(source) ? source.join("") : source;
    }
);

/**
 * Retrieves a palette by name. This function returns a function that accepts
 * a design system, returning a palette a palette or null
 */
export function palette(palette: Palettes): (designSystem: DesignSystem) => Palette {
    return ensureDesignSystemDefaults(
        (designSystem: DesignSystem): Palette => {
            let source: Palette;

            switch (palette) {
                case Palettes.accent:
                    source = designSystem.accentPaletteSource;
                    break;
                case Palettes.neutral:
                default:
                    source = designSystem.neutralPaletteSource;
                    break;
            }

            return generatePalette(source);
        }
    );
}

/**
 * A function to find the index of a swatch in a specified palette. If the color is found,
 * otherwise it will return -1
 */
export function findSwatchIndex(
    paletteType: Palettes,
    swatch: Swatch
): (designSystem: DesignSystem) => number {
    return (designSystem: DesignSystem): number => {
        const colorPalette: Palette = palette(paletteType)(designSystem);
        const index = colorPalette.indexOf(swatch);

        // If we don't find the string exactly, it might be because of color formatting differences
        return index !== -1
            ? index
            : colorPalette.findIndex(
                  (paletteSwatch: Swatch): boolean => {
                      return colorMatches(swatch, paletteSwatch);
                  }
              );
    };
}

/**
 * Returns the closest swatch in a palette to an input swatch.
 * If the input swatch cannot be converted to a color, 0 will be returned
 */
export function findClosestSwatchIndex(
    paletteType: Palettes,
    swatch: Swatch
): (designSystem: DesignSystem) => number {
    return ensureDesignSystemDefaults(
        (designSystem: DesignSystem): number => {
            let index: number = findSwatchIndex(paletteType, swatch)(designSystem);

            if (index !== -1) {
                return index;
            }

            const swatchLuminance = luminance(swatch);

            if (swatchLuminance === -1) {
                return 0;
            }

            type LuminanceMap = { luminance: number; index: number };

            return palette(paletteType)(designSystem)
                .map(
                    (swatch: Swatch, index: number): LuminanceMap => {
                        return {
                            luminance: luminance(swatch),
                            index,
                        };
                    }
                )
                .reduce(
                    (
                        previousValue: LuminanceMap,
                        currentValue: LuminanceMap
                    ): LuminanceMap => {
                        return Math.abs(currentValue.luminance - swatchLuminance) <
                            Math.abs(previousValue.luminance - swatchLuminance)
                            ? currentValue
                            : previousValue;
                    }
                ).index;
        }
    );
}
/**
 * Determines if we're in a dark theme, determined by comparing the contrast
 * of light key text and dark key text to the background. If light key text
 * has a higher contrast, then we're in a dark theme
 */
export const isDarkTheme = memoize(
    (designSystem: DesignSystem): boolean => {
        try {
            return (
                chroma.contrast(
                    neutralForegroundLight(designSystem),
                    designSystem.backgroundColor
                ) >
                chroma.contrast(
                    neutralForegroundDark(designSystem),
                    designSystem.backgroundColor
                )
            );
        } catch (e) {
            return false;
        }
    },
    (designSystem: DesignSystem): string => {
        return designSystem.backgroundColor;
    }
);
