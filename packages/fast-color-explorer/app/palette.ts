import {
    ColorPalette,
    ColorRGBA64,
    generateScaledPalettes,
} from "@microsoft/fast-colors";

export function createColorPalette(baseColor: ColorRGBA64): string[] {
    return new ColorPalette({
        baseColor,
        clipDark: 0,
        clipLight: 0,
        overlayDark: 0,
        overlayLight: 0,
        saturationDark: 0,
        saturationLight: 0,
        steps: 63,
    }).palette.map((color: ColorRGBA64) => color.toStringHexRGB().toUpperCase());
}
