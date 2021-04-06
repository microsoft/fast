import { Checkbox, CheckboxTemplate as template } from "@microsoft/fast-foundation";
import { CheckboxStyles as styles } from "./checkbox.styles";

/**
 * The FAST Checkbox Element. Implements {@link @microsoft/fast-foundation#Checkbox},
 * {@link @microsoft/fast-foundation#CheckboxTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-checkbox\>
 */
export const FASTCheckbox = Checkbox.compose({
    baseName: "checkbox",
    template,
    styles,
});

/**
 * Styles for Checkbox
 * @public
 */
export const CheckboxStyles = styles;
