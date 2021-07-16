import { HTMLRender, htmlRenderOriginatorId } from "./html-render";
import { htmlRenderTemplate as template } from "./html-render.template";
import { htmlRenderStyles as styles } from "./html-render.styles";

/**
 * A web component for rendering HTML using the MessageSystem.
 *
 * @alpha
 * @remarks
 * HTML Element: \<html-render\>
 */
export const fastToolingHTMLRender = HTMLRender.compose({
    baseName: "html-render",
    template,
    styles,
});

export { htmlRenderOriginatorId };
