import { HTMLRenderLayerInlineEdit } from "./html-render-layer-inline-edit";
import { htmlRenderLayerInlineEditTemplate as template } from "./html-render-layer-inline-edit.template";
import { htmlRenderLayerInlineEditStyles as styles } from "./html-render-layer-inline-edit.style";

/**
 * A web component for use in the default slot of the \<html-render\> web component.
 * It is used to update HTML text nodes.
 *
 * @alpha
 * @remarks
 * HTML Element: \<html-render-layer-inline-edit\>
 */
export const fastToolingHTMLRenderLayerInlineEdit = HTMLRenderLayerInlineEdit.compose({
    baseName: "html-render-layer-inline-edit",
    template,
    styles,
});
