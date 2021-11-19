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
        <svg
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="m6.38 10.04-1.9-1.9a.5.5 0 0 0-.7.71l2.24 2.25c.2.2.51.2.7 0l5.5-5.5a.5.5 0 1 0-.7-.7l-5.14 5.14Z"/>
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
