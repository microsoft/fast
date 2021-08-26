import {
    Combobox,
    ComboboxOptions,
    comboboxTemplate as template,
} from "@microsoft/fast-foundation";
import { comboboxStyles as styles } from "./combobox.styles";

/**
 * Combobox appearances
 * @public
 */
export type ComboboxAppearance = "filled" | "outline";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Combobox} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#comboboxTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-combobox\>
 *
 */
export const fastCombobox = Combobox.compose<ComboboxOptions>({
    baseName: "combobox",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
    indicator: `
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.44084 6.7154C2.96937 6.1766 3.35203 5.33333 4.06799 5.33333H11.9322C12.6481 5.33333 13.0308 6.1766 12.5593 6.7154L8.87809 10.9225C8.41322 11.4537 7.58689 11.4537 7.12202 10.9225L3.44084 6.7154ZM4.43528 6.33333L7.87462 10.264C7.94102 10.3399 8.05909 10.3399 8.12549 10.264L11.5648 6.33333H4.43528Z"/>
        </svg>
    `,
});

/**
 * Styles for combobox
 * @public
 */
export const comboboxStyles = styles;

/**
 * Base class for Combobox
 * @public
 */
export { Combobox };
