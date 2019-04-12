import defaultDesignSystem, {
    DesignSystem,
    DesignSystemResolver,
} from "../../design-system";
import { clamp } from "lodash-es";
import { colorMatches, contrast, luminance, Swatch } from "./common";
import { neutralForegroundDark, neutralForegroundLight } from "./neutral-foreground";
import { ColorPalette, ColorRGBA64 } from "@microsoft/fast-colors";

/**
 * The named palettes of the MSFT design system
 */
export enum PaletteType {
    neutral = "neutral",
    accent = "accent",
}

/**
 * The structure of a color palette
 */
export type Palette = Swatch[];

/**
 * Retrieves a palette by name. This function returns a function that accepts
 * a design system, returning a palette a palette or null
 */
export function palette(paletteType: PaletteType): DesignSystemResolver<Palette> {
    return (designSystem: DesignSystem | undefined): Palette => {
        switch (paletteType) {
            case PaletteType.accent:
                return (
                    (designSystem && designSystem.accentPalette) ||
                    defaultDesignSystem.accentPalette
                );
            case PaletteType.neutral:
            default:
                return (
                    (designSystem && designSystem.neutralPalette) ||
                    defaultDesignSystem.neutralPalette
                );
        }
    };
}

/**
 * A function to find the index of a swatch in a specified palette. If the color is found,
 * otherwise it will return -1
 */
export function findSwatchIndex(
    paletteType: PaletteType,
    swatch: Swatch
): DesignSystemResolver<number> {
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
): DesignSystemResolver<number> {
    return (designSystem: DesignSystem): number => {
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
    };
}

/**
 * Determines if the design-system should be considered in "dark mode".
 */
export function isDarkMode(designSystem: DesignSystem): boolean {
    const backgroundColor: string =
        (designSystem && designSystem.backgroundColor) ||
        defaultDesignSystem.backgroundColor;

    return (
        contrast(neutralForegroundLight(designSystem), backgroundColor) >=
        contrast(neutralForegroundDark(designSystem), backgroundColor)
    );
}

/**
 * Determines if the design-system should be considered in "light mode".
 */
export function isLightMode(designSystem: DesignSystem): boolean {
    return !isDarkMode(designSystem);
}

/**
 * Safely retrieves an index of a palette. The index is clamped to valid
 * array indexes so that a swatch is always returned
 */
export function getSwatch(index: number, colorPalette: Palette): Swatch {
    return colorPalette[clamp(index, 0, colorPalette.length - 1)];
}

export function swatchByMode(
    paletteName: PaletteType
): (a: number, b: number) => DesignSystemResolver<Swatch> {
    const paletteKey: keyof DesignSystem =
        paletteName === PaletteType.accent ? "accentPalette" : "neutralPalette";

    return (valueA: number, valueB?: number): DesignSystemResolver<Swatch> => {
        return (designSystem: DesignSystem): Swatch => {
            const currentPalette: Palette =
                (designSystem && designSystem[paletteKey]) ||
                defaultDesignSystem[paletteKey];

            return isDarkMode(designSystem)
                ? getSwatch(valueB, currentPalette)
                : getSwatch(valueA, currentPalette);
        };
    };
}
