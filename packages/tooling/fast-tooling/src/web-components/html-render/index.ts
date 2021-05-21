import { HTMLRender } from "./html-render";
import { HTMLRenderTemplate as template } from "./html-render.template";
import { htmlRenderStyles as styles } from "./html-render.styles";

/**
 *
 * @public
 * @remarks
 * HTML Element: \<html-render\>
 */
export const fastToolingHTMLRender = HTMLRender.compose({
    baseName: "html-render",
    template,
    styles,
});
