import { ColorPaletteConfig, parseColorHexRGB } from "@microsoft/fast-colors";

export const white: string = "#FFFFFF";
export const black: string = "#000000";
export const accent: string = "#0078D4";

export const paletteConstants: Partial<ColorPaletteConfig> = {
    steps: 63,
    clipLight: 0,
    clipDark: 0,
};

/**
 * Default palette sources
 */
export const neutralPaletteConfig: ColorPaletteConfig = {
    ...paletteConstants,
};

export const accentPaletteConfig: ColorPaletteConfig = {
    ...paletteConstants,
    baseColor: parseColorHexRGB(accent),
};
