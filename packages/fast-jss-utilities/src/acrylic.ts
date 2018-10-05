import { CSSRules } from "@microsoft/fast-jss-manager";

/*
 * - textureImage?: Optionally add a background image to provide texture for the acrylic
 * - backgroundColor: The background color. Should be an RGBa color value to provide transparency.
 *   If not an RGBa value, be sure to add opacity to the element or surface this is applied on.
 * - fallbackBackgroundColor: Applied in the event that backdrop-filter is not supported in the current browser.
 * - blurRadius?: The option to customize the blur filter. Defaults to 30px
 * - saturation?: The option to customize the saturation filter. Defaults to 125%
 */
export interface AcrylicConfig {
    textureImage?: string;
    backgroundColor: string;
    fallbackBackgroundColor: string;
    blurRadius?: string;
    saturation?: string;
}

/*
 * Check for backdrop-filter support within the current browser
 */
export const backdropFilterSupport: boolean =
    "backdrop-filter" in document.documentElement.style || "-webkit-backdrop-filter" in document.documentElement.style;

/*
 * Applies a partially transparent "acrylic" background to an element
 */
export function applyAcrylic<T>(config: AcrylicConfig): CSSRules<T> {
    const backdropFilterStyles: CSSRules<T> = {
        background: config.backgroundColor,
        backdropFilter: `blur(${config.blurRadius || "30px"}) saturate(${config.saturation || "125%"})`
    };

    const fallbackStyles: CSSRules<T> = {
        background: config.fallbackBackgroundColor
    };

    const styles: CSSRules<T> = backdropFilterSupport ? backdropFilterStyles : fallbackStyles;

    return {
        ...styles,
        "&::before": {
            content: "\"\"",
            background: config.textureImage ? `url(${config.textureImage}) repeat` : undefined,
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
