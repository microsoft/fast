import { Listbox, listboxTemplate as template } from "@microsoft/fast-foundation";
import { listboxStyles as styles } from "./listbox.styles";

/**
 * A function that returns a Listbox registration for configuring the component with a DesignSystem.
 * Implements Listbox
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* echo namespace */-listbox\>
 *
 */
export const /* @echo namespace */Listbox = Listbox.compose({
    baseName: "listbox",
    template,
    styles,
});

/**
 * Styles for Listbox
 * @public
 */
export const listboxStyles = styles;

/**
 * Base class for Listbox
 * @public
 */
export { Listbox };
