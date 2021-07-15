import { SwatchRGB } from "../swatch";
export declare function baseLayerLuminanceSwatch(luminance: number): SwatchRGB;
/**
 * Recommended values for light and dark mode for {@link @microsoft/fast-components#baseLayerLuminance}.
 *
 * @public
 */
export declare enum StandardLuminance {
    LightMode = 1,
    DarkMode = 0.23,
}
