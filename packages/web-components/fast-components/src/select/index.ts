import { Select, selectTemplate as template } from "@microsoft/fast-foundation";
import { selectStyles as styles } from "./select.styles";

/**
 * The FAST select Custom Element. Implements, {@link @microsoft/fast-foundation#Select}
 * {@link @microsoft/fast-foundation#selectTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-select\>
 *
 */
export const fastSelect = Select.compose({
    baseName: "fast",
    template,
    styles,
});

/**
 * Styles for Select
 * @public
 */
export const SelectStyles = styles;
