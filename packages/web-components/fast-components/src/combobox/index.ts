import { customElement } from "@microsoft/fast-element";
import { Combobox, ComboboxTemplate as template } from "@microsoft/fast-foundation";
import { ComboboxStyles as styles } from "./combobox.styles";

/**
 * The FAST Combobox Custom Element. Implements {@link @microsoft/fast-foundation#Combobox|Combobox},
 * {@link @microsoft/fast-foundation#ComboboxTemplate|ComboboxTemplate}
 *
 * @public
 * @remarks
 * HTML Element: \<fast-combobox\>
 *
 */
@customElement({
    name: "fast-combobox",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTCombobox extends Combobox {}

/**
 * Styles for combobox
 * @public
 */
export const ComboboxStyles = styles;
