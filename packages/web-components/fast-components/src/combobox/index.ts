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
export const FASTCombobox = Combobox.compose({
    baseName: "fast",
    template,
    styles,
})

/**
 * Styles for combobox
 * @public
 */
export const ComboboxStyles = styles;
