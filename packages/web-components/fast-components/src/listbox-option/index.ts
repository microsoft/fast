import {
    ListboxOption,
    listboxOptionTemplate as template,
} from "@microsoft/fast-foundation";
import { optionStyles as styles } from "./listbox-option.styles.js";

/**
 * A function that returns a {@link @microsoft/fast-foundation#ListboxOption} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#listboxOptionTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-option>`
 *
 */
export const fastOption = ListboxOption.compose({
    baseName: "option",
    template,
    styles,
});

/**
 * Base class for ListboxOption
 * @public
 */
export { ListboxOption };

export { styles as optionStyles };
