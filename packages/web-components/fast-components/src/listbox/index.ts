import { customElement } from "@microsoft/fast-element";
import { Listbox, ListboxTemplate as template } from "@microsoft/fast-foundation";
import { ListboxStyles as styles } from "./listbox.styles";

/**
 * The FAST listbox Custom Element. Implements, {@link @microsoft/fast-foundation#Listbox}
 * {@link @microsoft/fast-foundation#ListboxTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-listbox\>
 *
 */
@customElement({
    name: "fast-listbox",
    template,
    styles,
})
export class FASTListbox extends Listbox {}

/**
 * Styles for Listbox
 * @public
 */
export const ListboxStyles = styles;
