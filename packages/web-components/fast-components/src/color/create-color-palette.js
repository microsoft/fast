import { ComponentStateColorPalette } from "@microsoft/fast-colors";

export function createColorPalette(baseColor) {
    return new ComponentStateColorPalette({
        baseColor,
    }).palette.map(color => color.toStringHexRGB().toUpperCase());
}
