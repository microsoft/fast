import { Select, SelectTemplate as template } from "@microsoft/fast-foundation";
import { SelectStyles as styles } from "./select.styles";

/**
 * The FAST select Custom Element. Implements, {@link @microsoft/fast-foundation#Select}
 * {@link @microsoft/fast-foundation#SelectTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-select\>
 *
 */
export const FASTSelect = Select.compose({
    baseName: "fast",
    template,
    styles,
});

/**
 * Styles for Select
 * @public
 */
export const SelectStyles = styles;
