import { ICSSRules } from "@microsoft/fast-jss-manager";

/*
 * - textureImage: Optionally add a background image to provide texture for the acrylic
 * - background: The background color. Should be an RGBa color value to provide transparency.
 *   If not an RGBa value, be sure to add opacity to the element or surface this is applied on.
 * - fallbackBackground: Applied in the event that backdrop-filter is not supported in the current browser.
 * - blur?: The option to customize the blur filter. Defaults to 30px
 * - blur?: The option to customize the saturation filter. Defaults to 125%
 */
export interface IAcrylicConfig {
    textureImage?: string;
    background: string;
    fallbackBackground: string;
    blur?: string;
    saturation?: string;
}

/*
 * Check for backdrop-filter support within the current browser
 */
export const backdropFilterSupport: boolean =
    "backdrop-filter" in document.documentElement.style || "-webkit-backdrop-filter" in document.documentElement.style;

/*
 * Applies a parially transparent "acrylic" background to an element or UI surface
 */
export function applyAcrylic<T>(config: IAcrylicConfig): ICSSRules<T> {
    const backdropFilterStyles: ICSSRules<T> = {
        background: config.background,
        backdropFilter: `blur(${config.blur || "30px"}) saturate(${config.saturation || "125%"})`
    };

    const fallbackStyles: ICSSRules<T> = {
        background: config.fallbackBackground
    };

    const styles: ICSSRules<T> = backdropFilterSupport ? backdropFilterStyles : fallbackStyles;

    return {
        ...styles,
        "&::before": {
            content: "\"\"",
            background: config.textureImage ? `url(${config.textureImage}) repeat` : null,
            position: "absolute",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            opacity: ".02",
            pointerEvents: "none"
        }
    };
}
