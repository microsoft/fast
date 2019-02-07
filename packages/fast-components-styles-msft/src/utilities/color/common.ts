import { DesignSystem, DesignSystemResolver } from "../../design-system";
import { Swatch } from "./palette";
import chroma from "chroma-js";

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

/**
 * A function that returns a StatefulSwatch or a function that resolves a background swatch
 * and *then* resolves a StatefulSwatch
 */
export type StatefulSwatchResolver = DesignSystemResolver<StatefulSwatch> &
    BackgroundSwatchResolver<StatefulSwatch>;

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
export function StatefulSwatchToColorRecipeFactory(
    type: keyof StatefulSwatch,
    cb: StatefulSwatchResolver
): ColorRecipe {
    return (arg: DesignSystem | SwatchResolver): any => {
        if (typeof arg === "function") {
            return (designSystem: DesignSystem): Swatch => {
                return cb(
                    Object.assign({}, designSystem, {
                        backgroundColor: arg(designSystem),
                    })
                )[type];
            };
        } else {
            return cb(arg)[type];
        }
    };
}

/**
 * Determines if a string value represents a color
 */
export function isValidColor(color: string): boolean {
    try {
        return Boolean(chroma(color));
    } catch (e) {
        return false;
    }
}

/**
 * Determines if a color matches another color, regardless of color format
 */
export function colorMatches(a: any, b: any): boolean {
    try {
        return chroma.distance(a, b, "rgb") === 0;
    } catch (e) {
        return false;
    }
}

/**
 * Returns the contrast value between two colors. If either value is not a color, 0 will be returned
 */
export function contrast(a: any, b: any): number {
    try {
        return chroma.contrast(a, b, "rgb");
    } catch (e) {
        return 0;
    }
}

/**
 * Returns the relative luminance of a color. If the value is not a color, -1 will be returned
 */
export function luminance(color: any): number {
    try {
        return chroma(color).luminance();
    } catch (e) {
        return -1;
    }
}
