import { ColorPaletteConfig, parseColorHexRGB } from "@microsoft/fast-colors";

export const white: string = "#FFFFFF";
export const black: string = "#000000";
export const accentBaseColor: string = "#0078D4";
export const neutralBaseColor: string = "#808080";

/**
 * @deprecated
 */
const paletteConstants: Partial<ColorPaletteConfig> = {
    steps: 94,
    clipLight: 0,
    clipDark: 0,
};

/**
 * @deprecated
 */
export const neutralPaletteConfig: ColorPaletteConfig = {
    ...paletteConstants,
};

/**
 * @deprecated
 */
export const accentPaletteConfig: ColorPaletteConfig = {
    ...paletteConstants,
    baseColor: parseColorHexRGB("#0078D4"),
};
