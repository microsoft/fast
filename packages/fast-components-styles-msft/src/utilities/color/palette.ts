import { clamp } from "lodash-es";
import defaultDesignSystem, {
    DesignSystem,
    DesignSystemResolver,
} from "../../design-system";
import { backgroundColor } from "../../utilities/design-system";
import { accentPalette, neutralPalette } from "../design-system";
import {
    colorMatches,
    contrast,
    isValidColor,
    luminance,
    Swatch,
    SwatchResolver,
} from "./common";
import { neutralForegroundDark, neutralForegroundLight } from "./neutral-foreground";

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
                return accentPalette(designSystem);
            case PaletteType.neutral:
            default:
                return neutralPalette(designSystem);
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
        if (!isValidColor(swatch)) {
            return -1;
        }

        const colorPalette: Palette = palette(paletteType)(designSystem);
        const index: number = colorPalette.indexOf(swatch);

        // If we don't find the string exactly, it might be because of color formatting differences
        return index !== -1
            ? index
            : colorPalette.findIndex(
                  (paletteSwatch: Swatch): boolean => {
                      return (
                          isValidColor(paletteSwatch) &&
                          colorMatches(swatch, paletteSwatch)
                      );
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
        let swatchLuminance: number;

        if (index !== -1) {
            return index;
        }

        try {
            swatchLuminance = luminance(swatch);
        } catch (e) {
            swatchLuminance = -1;
        }

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
    const bg: string = backgroundColor(designSystem);

    return (
        contrast(neutralForegroundLight(designSystem), bg) >=
        contrast(neutralForegroundDark(designSystem), bg)
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

/**
 * Function to determine the direction on the array we should search
 */
type DirectionResolver = (referenceIndex: number, palette: Palette) => 1 | -1;
type ContrastCondition = (contrast: number) => boolean;
type InitialIndexResolver = (referenceColor: Swatch, paletteType: Palette) => number;

/**
 * Retrieves a swatch from an input palette, where the swatch's contrast against the reference color
 * passes an input condition. The direction to search in the palette is determined by an input condition.
 * The search for the palette will begin by another input function that should return the starting index.
 */
export function swatchByContrast(
    referenceColor: string | SwatchResolver
): ReturnType<Foo> {
    return (
        paletteResolver: DesignSystemResolver<Palette>
    ): ReturnType<ReturnType<Foo>> => {
        return (
            indexResolver: (
                referenceColor: string,
                palette: Palette,
                designSystem: DesignSystem
            ) => number
        ): ReturnType<ReturnType<ReturnType<Foo>>> => {
            return (
                directionResolver: DirectionResolver
            ): ReturnType<ReturnType<ReturnType<ReturnType<Foo>>>> => {
                return (
                    contrastCondition: (contrastRatio: number) => boolean
                ): DesignSystemResolver<Swatch> => {
                    return (designSystem: DesignSystem): Swatch => {
                        const color: Swatch =
                            typeof referenceColor === "function"
                                ? referenceColor(designSystem)
                                : referenceColor;
                        const sourcePalette: Palette = paletteResolver(designSystem);
                        const initialSearchIndex: number = indexResolver(
                            color,
                            sourcePalette,
                            designSystem
                        );
                        const direction: 1 | -1 = directionResolver(
                            initialSearchIndex,
                            sourcePalette
                        );
                    };
                };
            };
        };
    };
}

type Foo = (
    referenceColor: string | SwatchResolver
) => (
    paletteResolver: DesignSystemResolver<Palette>
) => (
    indexResolver: (referenceColor: string, palette: Palette) => number
) => (
    directionResolver: DirectionResolver
) => (condition: (contrast: number) => boolean) => DesignSystemResolver<Swatch>;
