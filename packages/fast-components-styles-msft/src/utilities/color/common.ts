import { DesignSystem, DesignSystemResolver } from "../../design-system";
import { memoize } from "lodash-es";
import {
    ColorRGBA64,
    contrastRatio,
    isColorStringHexRGB,
    isColorStringWebRGB,
    parseColorHexRGB,
    parseColorWebRGB,
    rgbToLuminance,
} from "@microsoft/fast-colors";

/**
 * Describes the format of a single color in a palette
 */
export type Swatch = string;

/**
 * Interface describing a family of swatches.
 */
export interface SwatchFamily {
    /**
     * The swatch to apply to the rest state
     */
    rest: Swatch;

    /**
     * The swatch to apply to the hover state
     */
    hover: Swatch;

    /**
     * The swatch to apply to the active state
     */
    active: Swatch;
}

/**
 * Interface describing a family of swatches applied as fills
 */
export interface FillSwatchFamily extends SwatchFamily {
    /**
     * The swatch to apply to the selected state
     */
    selected: Swatch;
}

/**
 * A DesignSystemResolver that resolves a Swatch
 */
export type SwatchResolver = DesignSystemResolver<Swatch>;

/**
 * A function that accepts a design system and resolves a SwatchFamily or FillSwatchFamily
 */
export type SwatchFamilyResolver<
    T extends SwatchFamily = SwatchFamily
> = DesignSystemResolver<T>;

/**
 * A function type that resolves a Swatch from a SwatchResolver
 * and applies it to the backgroundColor property of the design system
 * of the returned DesignSystemResolver
 */
export type DesignSystemResolverFromSwatchResolver<T> = (
    resolver: SwatchResolver
) => DesignSystemResolver<T>;

/**
 * The states that a swatch can have
 */
export enum SwatchFamilyType {
    rest = "rest",
    hover = "hover",
    active = "active",
    selected = "selected",
}

export type ColorRecipe<
    T extends Swatch | SwatchFamily | FillSwatchFamily
> = DesignSystemResolver<T> & DesignSystemResolverFromSwatchResolver<T>;

/**
 * A function to apply a named style or recipe. A ColorRecipe has several behaviors:
 * 1. When provided a callback function, the color Recipe returns a function that expects a design-system.
 * When called, the returned function will call the callback function with the input design-system and apply
 * the result of that function as background to the recipe. This is useful for applying text recipes to colors
 * other than the design system backgroundColor
 * 2. When provided a design system, the recipe will use that design-system to generate the color
 */
export type SwatchRecipe = ColorRecipe<Swatch>;

/**
 * Helper function to transform a SwatchFamilyResolver into simple ColorRecipe for simple use
 * use in stylesheets.
 */
export function swatchFamilyToSwatchRecipeFactory<T extends SwatchFamily>(
    type: keyof T,
    callback: SwatchFamilyResolver<T>
): SwatchRecipe {
    return (arg: DesignSystem | SwatchResolver): any => {
        if (typeof arg === "function") {
            return (designSystem: DesignSystem): Swatch => {
                return callback(
                    Object.assign({}, designSystem, {
                        backgroundColor: arg(designSystem),
                    })
                )[type as string];
            };
        } else {
            return callback(arg)[type];
        }
    };
}

/**
 * Converts a color string into a ColorRGBA64 instance. Returns null if the string cannot be converted.
 * Supports #RRGGBB and rgb(r, g, b) formats
 */
export function parseColorString(color: string): ColorRGBA64 | null {
    return isColorStringHexRGB(color)
        ? parseColorHexRGB(color)
        : isColorStringWebRGB(color)
            ? parseColorWebRGB(color)
            : null;
}

/**
 * Determines if a string value represents a color
 * Supports #RRGGBB and rgb(r, g, b) formats
 */
export function isValidColor(color: string): boolean {
    return isColorStringHexRGB(color) || isColorStringWebRGB(color);
}

/**
 * Determines if a color string matches another color.
 * Supports #RRGGBB and rgb(r, g, b) formats
 */
export function colorMatches(a: string, b: string): boolean {
    const alpha: ColorRGBA64 | null = parseColorString(a);
    const beta: ColorRGBA64 | null = parseColorString(b);

    return alpha !== null && beta !== null && alpha.equalValue(beta);
}

/**
 * Returns the contrast value between two colors. If either value is not a color, -1 will be returned
 * Supports #RRGGBB and rgb(r, g, b) formats
 */
export const contrast: (a: string, b: string) => number = memoize(
    (a: string, b: string): number => {
        const alpha: ColorRGBA64 | null = parseColorString(a);
        const beta: ColorRGBA64 | null = parseColorString(b);

        return alpha === null || beta === null ? -1 : contrastRatio(alpha, beta);
    },
    (a: string, b: string): string => a + b
);

/**
 * Returns the relative luminance of a color. If the value is not a color, -1 will be returned
 * Supports #RRGGBB and rgb(r, g, b) formats
 */
export function luminance(color: any): number {
    const parsedColor: ColorRGBA64 | null = parseColorString(color);

    return parsedColor === null ? -1 : rgbToLuminance(parsedColor);
}
