import { neutralPaletteConfig } from "./color-constants";
import React from "react";
import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
} from "../../design-system";
import { clamp, memoize } from "lodash-es";
import { colorMatches, contrast, isValidColor, luminance } from "./common";
import { neutralForegroundDark, neutralForegroundLight } from "./neutral-foreground";
import { ColorPalette, ColorPaletteConfig, ColorRGBA64 } from "@microsoft/fast-colors";

/**
 * The named palettes of the MSFT design system
 */
export enum PaletteType {
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

const generatePalette: (config: ColorPaletteConfig) => Palette = memoize(
    (config: ColorPaletteConfig): Palette => {
        return new ColorPalette(config).palette.map(
            (color: ColorRGBA64): string => color.toStringHexRGB().toUpperCase()
        );
    },
    (config: ColorPaletteConfig): string => {
        return Object.keys(config).reduce(
            (reduced: string, value: keyof ColorPaletteConfig): string => {
                const configValue: ColorPaletteConfig[keyof ColorPaletteConfig] =
                    config[value];

                if (typeof configValue === "number") {
                    return reduced.concat(configValue.toString());
                } else if (configValue instanceof ColorRGBA64) {
                    return reduced.concat(configValue.toStringWebRGBA());
                } else {
                    return "";
                }
            },
            ""
        );
    }
);

/**
 * Retrieves a palette by name. This function returns a function that accepts
 * a design system, returning a palette a palette or null
 */
export function palette(
    paletteType: PaletteType
): (designSystem: DesignSystem) => Palette {
    return ensureDesignSystemDefaults(
        (designSystem: DesignSystem): Palette => {
            let config: ColorPaletteConfig;

            switch (paletteType) {
                case PaletteType.accent:
                    config = designSystem.accentPaletteConfig;
                    break;
                case PaletteType.neutral:
                default:
                    config = designSystem.neutralPaletteConfig;
                    break;
            }

            return generatePalette(config);
        }
    );
}

/**
 * A function to find the index of a swatch in a specified palette. If the color is found,
 * otherwise it will return -1
 */
export function findSwatchIndex(
    paletteType: PaletteType,
    swatch: Swatch
): (designSystem: DesignSystem) => number {
    return (designSystem: DesignSystem): number => {
        const colorPalette: Palette = palette(paletteType)(designSystem);
        const index: number = colorPalette.indexOf(swatch);

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
    paletteType: PaletteType,
    swatch: Swatch
): (designSystem: DesignSystem) => number {
    return ensureDesignSystemDefaults(
        (designSystem: DesignSystem): number => {
            const index: number = findSwatchIndex(paletteType, swatch)(designSystem);

            if (index !== -1) {
                return index;
            }

            const swatchLuminance: number = luminance(swatch);

            if (swatchLuminance === -1) {
                return 0;
            }

            interface LuminanceMap {
                luminance: number;
                index: number;
            }

            return palette(paletteType)(designSystem)
                .map(
                    (mappedSwatch: Swatch, mappedIndex: number): LuminanceMap => {
                        return {
                            luminance: luminance(mappedSwatch),
                            index: mappedIndex,
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
 * of light neutral-foreground and dark neutral-foreground to the background. If light neutral-foreground
 * has a higher contrast, then we're in a dark theme
 */
export const isDarkTheme: DesignSystemResolver<boolean> = memoize(
    (designSystem: DesignSystem): boolean => {
        return (
            contrast(
                neutralForegroundLight(designSystem),
                designSystem.backgroundColor
            ) >=
            contrast(neutralForegroundDark(designSystem), designSystem.backgroundColor)
        );
    },
    (designSystem: DesignSystem): string => {
        return designSystem.backgroundColor;
    }
);

/**
 * Safely retrieves an index of a palette. The index is clamped to valid
 * array indexes so that a swatch is always returned
 */
export function getSwatch(index: number, colorPalette: Swatch[]): Swatch {
    return colorPalette[clamp(index, 0, colorPalette.length - 1)];
}
