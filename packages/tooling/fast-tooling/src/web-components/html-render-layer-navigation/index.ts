import { HTMLRenderLayerNavigation } from "./html-render-layer-navigation";
import { htmlRenderLayerNavigationTemplate as template } from "./html-render-layer-navigation.template";
import { htmlRenderLayerNavigationStyles as styles } from "./html-render-layer-navigation.style";

/**
 * A web component for use in the default slot of the \<html-render\> web component.
 * It is used to navigate the DOM.
 *
 * @alpha
 * @remarks
 * HTML Element: \<html-render-layer-navigation\>
 */
export const fastToolingHTMLRenderLayerNavigation = HTMLRenderLayerNavigation.compose({
    baseName: "html-render-layer-navigation",
    template,
    styles,
});
