import { Tab, tabTemplate as template } from "@microsoft/fast-foundation";
import { tabStyles as styles } from "./tab.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Tab} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#tabTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-tab\>
 */
export const fastTab = Tab.compose({
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
