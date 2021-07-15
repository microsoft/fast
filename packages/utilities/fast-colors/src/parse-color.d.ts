import { ColorRGBA64 } from "./color-rgba-64";
import { NamedColors, namedColorsConfigs } from "./named-colors";
/**
 * Test if a color matches #RRGGBB or #RGB
 * @public
 */
export declare function isColorStringHexRGB(raw: string): boolean;
/**
 * Test if a color matches #AARRGGBB or #ARGB
 * @public
 */
export declare function isColorStringHexARGB(raw: string): boolean;
/**
 * Test if a color matches #RRGGBBAA or #RGBA
 * @public
 */
export declare function isColorStringHexRGBA(raw: string): boolean;
/**
 * Test if a color matches rgb(rr, gg, bb)
 * @public
 */
export declare function isColorStringWebRGB(raw: string): boolean;
/**
 * Test if a color matches rgba(rr, gg, bb, aa)
 *
 * @public
 */
export declare function isColorStringWebRGBA(raw: string): boolean;
/**
 * Tests whether a color is in {@link @microsoft/fast-colors#NamedColors}.
 * @param raw - the color name to test
 * @public
 */
export declare function isColorNamed(raw: string | NamedColors): raw is NamedColors;
/**
 * Converts a hexadecimal color string to a {@link @microsoft/fast-colors#ColorRGBA64}.
 * @param raw - a color string in the form of "#RRGGBB" or "#RGB"
 * @example
 * ```ts
 * parseColorHexRGBA("#FF0000");
 * parseColorHexRGBA("#F00");
 * ```
 * @public
 */
export declare function parseColorHexRGB(raw: string): ColorRGBA64 | null;
/**
 * Converts a hexadecimal color string to a {@link @microsoft/fast-colors#ColorRGBA64}.
 * @param raw - a color string in the form of "#AARRGGBB" or "#ARGB"
 * @example
 * ```ts
 * parseColorHexRGBA("#AAFF0000");
 * parseColorHexRGBA("#AF00");
 * ```
 * @public
 */
export declare function parseColorHexARGB(raw: string): ColorRGBA64 | null;
/**
 * Converts a hexadecimal color string to a {@link @microsoft/fast-colors#ColorRGBA64}.
 * @param raw - a color string in the form of "#RRGGBBAA" or "#RGBA"
 * @example
 * ```ts
 * parseColorHexRGBA("#FF0000AA");
 * parseColorHexRGBA("#F00A");
 * ```
 * @public
 */
export declare function parseColorHexRGBA(raw: string): ColorRGBA64 | null;
/**
 * Converts a rgb color string to a {@link @microsoft/fast-colors#ColorRGBA64}.
 * @param raw - a color string format "rgba(RR,GG,BB)" where RR,GG,BB are [0,255]
 * @example
 * ```ts
 * parseColorWebRGB("rgba(255, 0, 0");
 * ```
 * @public
 */
export declare function parseColorWebRGB(raw: string): ColorRGBA64 | null;
/**
 * Converts a rgba color string to a {@link @microsoft/fast-colors#ColorRGBA64}.
 * @param raw - a color string format "rgba(RR,GG,BB,a)" where RR,GG,BB are [0,255] and a is [0,1]
 * @example
 * ```ts
 * parseColorWebRGBA("rgba(255, 0, 0, 1");
 * ```
 * @public
 */
export declare function parseColorWebRGBA(raw: string): ColorRGBA64 | null;
/**
 * Converts a named color to a {@link @microsoft/fast-colors#ColorRGBA64}.
 * @param raw - a {@link https://www.w3schools.com/colors/colors_names.asp | CSS color name}.
 * @example
 * ```ts
 * parseColorNamed("red");
 * ```
 * @public
 */
export declare function parseColorNamed(
    raw: keyof typeof namedColorsConfigs
): ColorRGBA64 | null;
/**
 *
  Expects any of the following and attempts to determine which is being used
 * #RRGGBB, #AARRGGBB, rgb(RR,GG,BB) rgba(RR,GG,BB,a),
 * or any of the {@link https://www.w3schools.com/colors/colors_names.asp | CSS color names}.
 * @param raw - the color string to parse
 * @public
 */
export declare function parseColor(raw: string): ColorRGBA64 | null;
