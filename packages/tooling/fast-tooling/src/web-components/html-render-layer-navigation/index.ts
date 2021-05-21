import { HTMLRenderLayerNavigation } from "./html-render-layer-navigation";
import { HTMLRenderLayerNavigationTemplate as template } from "./html-render-layer-navigation.template";
import { htmlRenderLayerNavigationStyles as styles } from "./html-render-layer-navigation.style";

/**
 *
 * @public
 * @remarks
 * HTML Element: \<html-render-layer-navigation\>
 */
export const fastToolingHTMLRenderLayerNavigation = HTMLRenderLayerNavigation.compose({
    baseName: "html-render-layer-navigation",
    template,
    styles,
});
