import { customElement } from "@microsoft/fast-element";
import { WrapperStyles as styles } from "./wrapper.styles";
import { Wrapper as BaseWrapper } from "./wrapper";
import { WrapperTemplate as template } from "./wrapper.template";

/**
 * @public
 * @remarks
 * HTML Element: \<creator-wrapper\>
 */
@customElement({
    name: "creator-wrapper",
    template,
    styles,
})
export class Wrapper extends BaseWrapper {}
