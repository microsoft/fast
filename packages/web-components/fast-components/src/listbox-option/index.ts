import { customElement } from "@microsoft/fast-element";
import {
    ListboxOption,
    ListboxOptionTemplate as template,
} from "@microsoft/fast-foundation";
import { OptionStyles as styles } from "./listbox-option.styles";

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
export class FASTOption extends ListboxOption {}

/**
 * Styles for Option
 * @public
 */
export const OptionStyles = styles;
