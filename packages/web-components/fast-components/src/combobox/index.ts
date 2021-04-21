import { Combobox, comboboxTemplate as template } from "@microsoft/fast-foundation";
import { comboboxStyles as styles } from "./combobox.styles";

/**
 * The FAST Combobox Custom Element. Implements {@link @microsoft/fast-foundation#Combobox},
 * {@link @microsoft/fast-foundation#comboboxTemplate}
 *
 * @public
 * @remarks
 * HTML Element: \<fast-combobox\>
 *
 */
export const fastCombobox = Combobox.compose({
    baseName: "combobox",
    template,
    styles,
});

/**
 * Styles for combobox
 * @public
 */
export const comboboxStyles = styles;
