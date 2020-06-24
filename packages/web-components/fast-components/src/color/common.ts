import {
    ColorRGBA64,
    contrastRatio,
    isColorStringHexRGB,
    isColorStringWebRGB,
    parseColorHexRGB,
    parseColorWebRGB,
    rgbToRelativeLuminance,
} from "@microsoft/fast-colors";
import { memoize } from "lodash-es";
import { DesignSystemResolver, FASTDesignSystem } from "../fast-design-system";

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

    /**
     * The swatch to apply to the focus state
     */
    focus: Swatch;
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
 * @internal
 */
export type DesignSystemResolverFromSwatchResolver<T> = (
    resolver: SwatchResolver
) => DesignSystemResolver<T>;

/**
 * The states that a swatch can have
 * @internal
 */
export enum SwatchFamilyType {
    rest = "rest",
    hover = "hover",
    active = "active",
    focus = "focus",
    selected = "selected",
}

/**
 * A function that resolves a color when provided a design system
 * or resolves a ColorRecipe when provided a SwatchResolver
 */
export type ColorRecipe<T> = DesignSystemResolver<T> &
    DesignSystemResolverFromSwatchResolver<T>;

/**
 * @internal
 */
export function colorRecipeFactory<T>(recipe: DesignSystemResolver<T>): ColorRecipe<T> {
    const memoizedRecipe: typeof recipe = memoize(recipe);

    function curryRecipe(designSystem: FASTDesignSystem): T;
    function curryRecipe(
        backgroundResolver: SwatchResolver
    ): (designSystem: FASTDesignSystem) => T;
    function curryRecipe(arg: any): any {
        if (typeof arg === "function") {
            return (designSystem: FASTDesignSystem): T => {
                return memoizedRecipe(
                    Object.assign({}, designSystem, {
                        backgroundColor: arg(designSystem),
                    })
                );
            };
        } else {
            return memoizedRecipe(arg);
        }
    }

    return curryRecipe;
}

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
 *
 * @internal
 */
export function swatchFamilyToSwatchRecipeFactory<T extends SwatchFamily>(
    type: keyof T,
    callback: SwatchFamilyResolver<T>
): SwatchRecipe {
    const memoizedRecipe: typeof callback = memoize(callback);
    return (arg: FASTDesignSystem | SwatchResolver): any => {
        if (typeof arg === "function") {
            return (designSystem: FASTDesignSystem): Swatch => {
                return memoizedRecipe(
                    Object.assign({}, designSystem, {
                        backgroundColor: arg(designSystem),
                    })
                )[type as string];
            };
        } else {
            return memoizedRecipe(arg)[type];
        }
    };
}

/**
 * Converts a color string into a ColorRGBA64 instance.
 * Supports #RRGGBB and rgb(r, g, b) formats
 *
 * @public
 */
export const parseColorString: (color: string) => ColorRGBA64 = memoize(
    (color: string): ColorRGBA64 => {
        let parsed: ColorRGBA64 | null = parseColorHexRGB(color);

        if (parsed !== null) {
            return parsed;
        }

        parsed = parseColorWebRGB(color);

        if (parsed !== null) {
            return parsed;
        }

        throw new Error(
            `${color} cannot be converted to a ColorRGBA64. Color strings must be one of the following formats: "#RGB", "#RRGGBB", or "rgb(r, g, b)"`
        );
    }
);

/**
 * Determines if a string value represents a color
 * Supports #RRGGBB and rgb(r, g, b) formats
 * @internal
 */
export function isValidColor(color: string): boolean {
    return isColorStringHexRGB(color) || isColorStringWebRGB(color);
}

/**
 * Determines if a color string matches another color.
 * Supports #RRGGBB and rgb(r, g, b) formats
 * @internal
 */
export function colorMatches(a: string, b: string): boolean {
    return parseColorString(a).equalValue(parseColorString(b));
}

/**
 * Returns the contrast value between two color strings.
 * Supports #RRGGBB and rgb(r, g, b) formats.
 * @internal
 */
export const contrast: (a: string, b: string) => number = memoize(
    (a: string, b: string): number => {
        return contrastRatio(parseColorString(a), parseColorString(b));
    },
    (a: string, b: string): string => a + b
);

/**
 * Returns the relative luminance of a color. If the value is not a color, -1 will be returned
 * Supports #RRGGBB and rgb(r, g, b) formats
 * @internal
 */
export function luminance(color: string): number {
    return rgbToRelativeLuminance(parseColorString(color));
}

/**
 * @internal
 */
export function designSystemResolverMax(
    ...args: Array<DesignSystemResolver<number>>
): DesignSystemResolver<number> {
    return (designSystem: FASTDesignSystem): number =>
        Math.max.apply(
            null,
            args.map((fn: DesignSystemResolver<number>) => fn(designSystem))
        );
}

/**
 * @internal
 */
export const clamp: (value: number, min: number, max: number) => number = (
    value: number,
    min: number,
    max: number
): number => Math.min(Math.max(value, min), max);
