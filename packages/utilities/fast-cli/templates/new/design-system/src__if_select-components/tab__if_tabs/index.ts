import { Tab, tabTemplate as template } from "@microsoft/fast-foundation";
import { tabStyles as styles } from "./tab.styles";

/**
 * A function that returns a Tab registration for configuring the component with a DesignSystem.
 * Implements Tab
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-tab\>
 */
export const /* @echo namespace */Tab = Tab.compose({
    baseName: "tab",
    template,
    styles,
});

/**
 * Styles for Tab
 * @public
 */
export const tabStyles = styles;

/**
 * Base class for Tab
 * @public
 */
export { Tab };
