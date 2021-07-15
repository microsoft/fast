import {
    ListboxOption,
    listboxOptionTemplate as template,
} from "@microsoft/fast-foundation";
import { optionStyles as styles } from "./listbox-option.styles";

/**
 * A function that returns a Option registration for configuring the component with a DesignSystem.
 * Implements Option
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-option\>
 *
 */
export const /* @echo namespace */Option = ListboxOption.compose({
    baseName: "option",
    template,
    styles,
});

/**
 * Styles for Option
 * @public
 */
export const optionStyles = styles;

/**
 * Base class for ListboxOption
 * @public
 */
export { ListboxOption };
