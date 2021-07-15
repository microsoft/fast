import { SwatchRGB } from "../swatch";
export function baseLayerLuminanceSwatch(luminance) {
    return SwatchRGB.create(luminance, luminance, luminance);
}
/**
 * Recommended values for light and dark mode for {@link @microsoft/fast-components#baseLayerLuminance}.
 *
 * @public
 */
export var StandardLuminance;
(function (StandardLuminance) {
    StandardLuminance[(StandardLuminance["LightMode"] = 1)] = "LightMode";
    StandardLuminance[(StandardLuminance["DarkMode"] = 0.23)] = "DarkMode";
})(StandardLuminance || (StandardLuminance = {}));
