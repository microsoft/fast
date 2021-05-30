import { customElement } from "@microsoft/fast-element";
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
@customElement({
    name: "css-layout",
    template,
    styles,
})
export class FASTToolingCSSLayout extends CSSLayout {}
export { cssLayoutCssProperties } from "./css-layout.css-properties";
