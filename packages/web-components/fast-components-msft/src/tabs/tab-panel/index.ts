import { customElement } from "@microsoft/fast-element";
import { TabPanel, TabPanelTemplate as template } from "@microsoft/fast-components";
import { TabPanelStyles as styles } from "./tab-panel.styles";

@customElement({
    name: "fast-tab-panel",
    template,
    styles,
})
export class FASTTabPanel extends TabPanel {}
