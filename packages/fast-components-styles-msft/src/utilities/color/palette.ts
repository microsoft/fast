import { clamp, inRange } from "lodash-es";
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
import { black, white } from "./color-constants";

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

    return contrast(white, bg) >= contrast(black, bg);
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
): (
    a: number | DesignSystemResolver<number>,
    b: number | DesignSystemResolver<number>
) => DesignSystemResolver<Swatch> {
    const paletteKey: keyof DesignSystem =
        paletteName === PaletteType.accent ? "accentPalette" : "neutralPalette";

    return (
        valueA: number | DesignSystemResolver<number>,
        valueB?: number | DesignSystemResolver<number>
    ): DesignSystemResolver<Swatch> => {
        return (designSystem: DesignSystem): Swatch => {
            const currentPalette: Palette =
                (designSystem && designSystem[paletteKey]) ||
                defaultDesignSystem[paletteKey];

            const bEval: number =
                typeof valueB === "function" ? valueB(designSystem) : valueB;
            const aEval: number =
                typeof valueA === "function" ? valueA(designSystem) : valueA;
            return isDarkMode(designSystem)
                ? getSwatch(bEval, currentPalette)
                : getSwatch(aEval, currentPalette);
        };
    };
}

// disable type-defs because this a deeply curried function and the call-signature is pretty complicated
// and typescript can work it out automatically for consumers
/* tslint:disable:typedef */
/**
 * Retrieves a swatch from an input palette, where the swatch's contrast against the reference color
 * passes an input condition. The direction to search in the palette is determined by an input condition.
 * Where to begin the search in the palette will be determined another input function that should return the starting index.
 * example: swatchByContrast(
 *              "#FFF" // compare swatches against "#FFF"
 *          )(
 *              neutralPalette // use the neutral palette from the DesignSystem - since this is a function, it will be evaluated with the DesignSystem
 *          )(
 *              () => 0 // begin searching for a swatch at the beginning of the neutral palette
 *          )(
 *              () => 1 // While searching, search in the direction toward the end of the array (-1 moves towards the beginning of the array)
 *          )(
 *              (contrast: number) => contrast >= 4.5 // A swatch is only valid if the contrast is greater than 4.5
 *          )(
 *              designSystem // Pass the design-system. The first swatch that passes the previous condition will be returned from this function
 *          )
 */
export function swatchByContrast(referenceColor: string | SwatchResolver) {
    /**
     * A function that expects a function that resolves a palette
     */
    return (paletteResolver: DesignSystemResolver<Palette>) => {
        /**
         * A function that expects a function that resolves the index
         * of the palette that the algorithm should begin looking for a swatch at
         */
        return (
            indexResolver: (
                referenceColor: string,
                palette: Palette,
                designSystem: DesignSystem
            ) => number
        ) => {
            /**
             * A function that expects a function that determines which direction in the
             * palette we should look for a swatch relative to the initial index
             */
            return (
                directionResolver: (
                    referenceIndex: number,
                    palette: Palette,
                    designSystem: DesignSystem
                ) => 1 | -1
            ) => {
                /**
                 * A function that expects a function that determines if the contrast
                 * between the reference color and color from the palette are acceptable
                 */
                return (
                    contrastCondition: (contrastRatio: number) => boolean
                ): DesignSystemResolver<Swatch> => {
                    /**
                     * A function that accepts a design-system. It resolves all of the curried arguments
                     * and loops over the palette until we reach the bounds of the palette or the condition
                     * is satisfied. Once either the condition is satisfied or we reach the end of the palette,
                     * we return the color
                     */
                    return (designSystem: DesignSystem): Swatch => {
                        const color: Swatch =
                            typeof referenceColor === "function"
                                ? referenceColor(designSystem)
                                : referenceColor;
                        const sourcePalette: Palette = paletteResolver(designSystem);
                        const initialSearchIndex: number = clamp(
                            indexResolver(color, sourcePalette, designSystem),
                            0,
                            sourcePalette.length - 1
                        );
                        const direction: 1 | -1 = directionResolver(
                            initialSearchIndex,
                            sourcePalette,
                            designSystem
                        );
                        const length: number = sourcePalette.length;
                        let index: number = initialSearchIndex;

                        while (
                            inRange(index + direction, 0, length) &&
                            inRange(index, 0, length) &&
                            !contrastCondition(contrast(color, sourcePalette[index]))
                        ) {
                            index = index + direction;
                        }

                        return sourcePalette[index];
                    };
                };
            };
        };
    };
}

/* tslint:enable:typedef */
export function findClosestBackgroundIndex(designSystem: DesignSystem): number {
    return findClosestSwatchIndex(PaletteType.neutral, backgroundColor(designSystem))(
        designSystem
    );
}
