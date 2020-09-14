import { customElement } from "@microsoft/fast-element";
import { SelectTemplate as template, Select } from "@microsoft/fast-foundation";
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
@customElement({
    name: "fast-select",
    template,
    styles,
})
export class FASTSelect extends Select {}

/**
 * Styles for Select
 * @public
 */
export const SelectStyles = styles;

export * from "./listbox";
export * from  "./option";
