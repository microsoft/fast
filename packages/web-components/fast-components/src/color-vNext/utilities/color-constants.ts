import { parseColorHexRGB } from "@microsoft/fast-colors";
import { SwatchRGB } from "../swatch";

/**
 * @internal
 */
export const white = new SwatchRGB(1, 1, 1);
/**
 * @internal
 */
export const black = new SwatchRGB(0, 0, 0);

/**
 * @internal
 */
export const middleGrey = new SwatchRGB(0.5, 0.5, 0.5);

/**
 * @internal
 */

export const accentBase = SwatchRGB.fromObject(parseColorHexRGB("#DA1A5F")!);
