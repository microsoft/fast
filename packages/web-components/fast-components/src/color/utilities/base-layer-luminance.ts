import { SwatchRGB } from "../swatch";

export function baseLayerLuminanceSwatch(luminance: number) {
    return SwatchRGB.create(luminance, luminance, luminance);
}

/**
 * Recommended values for light and dark mode for {@link @microsoft/fast-components#baseLayerLuminance}.
 *
 * @public
 */
export enum StandardLuminance {
    LightMode = 1,
    DarkMode = 0.23,
}
