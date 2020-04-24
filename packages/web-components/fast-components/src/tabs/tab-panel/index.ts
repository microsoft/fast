import { customElement } from "@microsoft/fast-element";
import { TabPanel } from "./tab-panel";
import { TabPanelTemplate as template } from "./tab-panel.template";
import { TabPanelStyles as styles } from "./tab-panel.styles";

@customElement({
    name: "fast-tab-panel",
    template,
    styles,
})
export class FASTTabPanel extends TabPanel {}
export * from "./tab-panel.template";
export * from "./tab-panel.styles";
export * from "./tab-panel";
