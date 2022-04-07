import { parseColorHexRGB } from "@microsoft/fast-colors";
import { SwatchRGB } from "../swatch.js";

/**
 * @internal
 */
export const white = SwatchRGB.create(1, 1, 1);
/**
 * @internal
 */
export const black = SwatchRGB.create(0, 0, 0);

/**
 * @internal
 */
/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
export const middleGrey = SwatchRGB.from(parseColorHexRGB("#808080")!);

/**
 * @internal
 */
/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
export const accentBase = SwatchRGB.from(parseColorHexRGB("#DA1A5F")!);
