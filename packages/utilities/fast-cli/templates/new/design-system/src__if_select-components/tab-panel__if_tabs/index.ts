import { TabPanel, tabPanelTemplate as template } from "@microsoft/fast-foundation";
import { tabPanelStyles as styles } from "./tab-panel.styles";

/**
 * A function that returns a Tab Panel registration for configuring the component with a DesignSystem.
 * Implements Tab Panel
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-tab-panel\>
 */
export const /* @echo namespace */TabPanel = TabPanel.compose({
    baseName: "tab-panel",
    template,
    styles,
});

/**
 * Styles for TabPanel
 * @public
 */
export const tabPanelStyles = styles;

/**
 * Base class for TabPanel
 * @public
 */
export { TabPanel };
