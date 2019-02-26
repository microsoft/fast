import { ColorPaletteConfig, parseColorHexRGB } from "@microsoft/fast-colors";

export const white: string = "#FFFFFF";
export const black: string = "#000000";
export const accent: string = "#0078D4";
export const paletteSteps: number = 64;

/**
 * Default palette sources
 */
export const neutralPaletteConfig: ColorPaletteConfig = {
    steps: paletteSteps,
};
export const accentPaletteConfig: ColorPaletteConfig = {
    baseColor: parseColorHexRGB(accent),
    steps: paletteSteps,
};
