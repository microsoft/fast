import { SwatchRGB } from "../swatch.js";

export function baseLayerLuminanceSwatch(luminance: number) {
    return SwatchRGB.create(luminance, luminance, luminance);
}

/**
 * Recommended values for light and dark mode for {@link @microsoft/fast-components#baseLayerLuminance}.
 *
 * @public
 */
export const StandardLuminance = {
    LightMode: 1,
    DarkMode: 0.23,
} as const;

/**
 * Types of recommended values for light and dark mode for {@link @microsoft/fast-components#baseLayerLuminance}.
 *
 * @public
 */
export type StandardLuminance = typeof StandardLuminance[keyof typeof StandardLuminance];
