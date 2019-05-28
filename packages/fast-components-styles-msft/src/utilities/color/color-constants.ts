import { ColorPaletteConfig, parseColorHexRGB } from "@microsoft/fast-colors";

export const white: string = "#FFFFFF";
export const black: string = "#000000";

export const paletteConstants: Partial<ColorPaletteConfig> = {
    steps: 63,
    clipLight: 0,
    clipDark: 0,
};

/**
 * Default palette sources
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
