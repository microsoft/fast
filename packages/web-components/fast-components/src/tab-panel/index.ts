import { TabPanel, TabPanelTemplate as template } from "@microsoft/fast-foundation";
import { TabPanelStyles as styles } from "./tab-panel.styles";

/**
 * The FAST Tab Panel Custom Element. Implements {@link @microsoft/fast-foundation#TabPanel},
 * {@link @microsoft/fast-foundation#TabPanelTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-tab-panel\>
 */
export const fastTabPanel = TabPanel.compose({
    baseName: "tab-panel",
    template,
    styles,
});

/**
 * Styles for TabPanel
 * @public
 */
export const TabPanelStyles = styles;
