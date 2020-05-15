import { customElement } from "@microsoft/fast-element";
import { TabPanel, TabPanelTemplate as template } from "@microsoft/fast-foundation";
import { TabPanelStyles as styles } from "./tab-panel.styles.js";

@customElement({
    name: "fast-tab-panel",
    template,
    styles,
})
export class FASTTabPanel extends TabPanel {}
