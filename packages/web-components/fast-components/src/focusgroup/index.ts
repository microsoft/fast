import { Focusgroup, FocusgroupTemplate as template } from "@microsoft/fast-foundation";
import { FocusgroupStyles as styles } from "./focusgroup.styles";

/**
 * A function that regesiters the fast-focusgroup component
 */
export const fastFocusgroup = Focusgroup.compose({
    baseName: "focusgroup",
    styles,
    template,
});

/**
 * Styles for focusgroup component
 */
export { styles as FocusgroupStyles };
