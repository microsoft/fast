import { DesignSystem, DesignSystemResolver } from "../../design-system";
import { Swatch } from "./palette";
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
 * A function type that resolves a color from a design system
 */
export type SwatchResolver = DesignSystemResolver<Swatch>;

/**
 * A function type that resolves a background color from a SwatchResolver
 * and applies it to the design system of the returned DesignSystemResolver
 */
export type BackgroundSwatchResolver<T> = (
    resolver: SwatchResolver
) => DesignSystemResolver<T>;

export type SwatchFamilyResolver<T> = DesignSystemResolver<T> &
    BackgroundSwatchResolver<T>;
/**
 * A function that returns a StatefulSwatch or a function that resolves a background swatch
 * and *then* resolves a StatefulSwatch
 */
export type StatefulSwatchResolver = SwatchFamilyResolver<StatefulSwatch>;

/**
 * A function that returns a FillSwatch or a function that resolves a background swatch
 * and *then* resolves a FillSwatch
 */
export type FillSwatchResolver = SwatchFamilyResolver<FillSwatch>;

/**
 * The states that a swatch can have
 */
export enum SwatchStates {
    rest = "rest",
    hover = "hover",
    active = "active",
    selected = "selected",
}

/**
 * Interface describing a group of swatches representing UI states of a single swatch
 */
export interface StatefulSwatch {
    /**
     * The rest color of a brush
     */
    rest: Swatch;

    /**
     * The hover color of a brush
     */
    hover: Swatch;

    /**
     * The active color of a brush
     */
    active: Swatch;
}

export interface FillSwatch extends StatefulSwatch {
    /**
     * The selected color of a brush
     */
    selected: Swatch;
}

/**
 * A function to apply a named style or recipe. A ColorRecipe has several behaviors:
 * 1. When provided a callback function, the color Recipe returns a function that expects a design-system.
 * When called, the returned function will call the callback function with the input design-system and apply
 * the result of that function as background to the recipe. This is useful for applying text recipes to colors
 * other than the design system backgroundColor
 * 2. When provided a design system, the recipe will use that design-system to generate the color
 */
export type ColorRecipe = SwatchResolver & BackgroundSwatchResolver<Swatch>;

/**
 * Helper function to transform a StatefulSwatchResolver into simple ColorRecipe for simple use
 * use in stylesheets.
 */
export function StatefulSwatchToColorRecipeFactory<T extends StatefulSwatch>(
    type: keyof T,
    callback: SwatchFamilyResolver<T>
): ColorRecipe {
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
export function contrast(a: string, b: string): number {
    const alpha: ColorRGBA64 | null = parseColorString(a);
    const beta: ColorRGBA64 | null = parseColorString(b);

    return alpha === null || beta === null ? -1 : contrastRatio(alpha, beta);
}

/**
 * Returns the relative luminance of a color. If the value is not a color, -1 will be returned
 * Supports #RRGGBB and rgb(r, g, b) formats
 */
export function luminance(color: any): number {
    const parsedColor: ColorRGBA64 | null = parseColorString(color);

    return parsedColor === null ? -1 : rgbToLuminance(parsedColor);
}
