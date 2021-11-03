import { Listbox, listboxTemplate as template } from "@microsoft/fast-foundation";
import { listboxStyles as styles } from "./listbox.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Listbox} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#listboxTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-listbox>`
 *
 */
export const fastListbox = Listbox.compose({
    baseName: "listbox",
    template,
    styles,
});

/**
 * Base class for Listbox
 * @public
 */
export { Listbox };

export { styles as listboxStyles };
