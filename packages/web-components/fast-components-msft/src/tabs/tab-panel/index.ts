import { customElement } from "@microsoft/fast-element";
import { TabPanel, TabPanelTemplate as template } from "@microsoft/fast-components";
import { TabPanelStyles as styles } from "./tab-panel.styles.js";

@customElement({
    name: "msft-tab-panel",
    template,
    styles,
})
export class MSFTTabPanel extends TabPanel {}
