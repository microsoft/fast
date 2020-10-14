import { customElement } from "@microsoft/fast-element";
import { Option, OptionTemplate as template } from "@microsoft/fast-foundation";
import { OptionStyles as styles } from "./option.styles";

/**
 * The FAST option Custom Element. Implements, {@link @microsoft/fast-foundation#Option}
 * {@link @microsoft/fast-foundation#OptionTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-option\>
 *
 */
@customElement({
    name: "fast-option",
    template,
    styles,
})
export class FASTOption extends Option {}

/**
 * Styles for Option
 * @public
 */
export const OptionStyles = styles;
