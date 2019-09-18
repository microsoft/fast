import { ColorRGBA64, ComponentStateColorPalette } from "@microsoft/fast-colors";
import { Palette } from "./palette";

export function createColorPalette(baseColor: ColorRGBA64): Palette {
    return new ComponentStateColorPalette({
        baseColor,
    }).palette.map((color: ColorRGBA64) => color.toStringHexRGB().toUpperCase());
}
