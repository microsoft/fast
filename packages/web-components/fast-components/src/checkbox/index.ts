import {
    Checkbox,
    CheckboxOptions,
    checkboxTemplate as template,
} from "@microsoft/fast-foundation";
import { checkboxStyles as styles } from "./checkbox.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Checkbox} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#checkboxTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-checkbox>`
 */
export const fastCheckbox = Checkbox.compose<CheckboxOptions>({
    baseName: "checkbox",
    template,
    styles,
    checkedIndicator: `
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.375 10.0429L4.47855 8.14645C4.28329 7.9512 3.96671 7.9512 3.77145 8.14645C3.57619 8.3417 3.57619 8.6583 3.77145 8.85355L6.02145 11.1035C6.21671 11.2988 6.53329 11.2988 6.72856 11.1035L12.2285 5.60355C12.4238 5.40829 12.4238 5.09171 12.2285 4.89645C12.0333 4.70119 11.7167 4.70119 11.5215 4.89645L6.375 10.0429Z"/>
        </svg>
    `,
    indeterminateIndicator: `
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="7" width="8" height="2" rx="1"/>
        </svg>
    `,
});

/**
 * Base class for Checkbox
 * @public
 */
export { Checkbox };

export { styles as checkboxStyles };
