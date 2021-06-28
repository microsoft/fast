import { CSSLayoutTemplate as template } from "./css-layout.template";
import { cssLayoutStyles as styles } from "./css-layout.styles";
import { CSSLayout } from "./css-layout";

/**
 * The FAST Tooling CSS layout Element.
 *
 * @public
 * @remarks
 * HTML Element: \<css-layout\>
 */
export const fastToolingCSSLayout = CSSLayout.compose({
    baseName: "css-layout",
    template,
    styles,
});
export { cssLayoutCssProperties } from "./css-layout.css-properties";
