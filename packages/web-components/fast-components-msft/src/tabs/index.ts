import { customElement } from "@microsoft/fast-element";
import { Tabs, TabsTemplate as template } from "@microsoft/fast-components";
import { TabsStyles as styles } from "./tabs.styles";

@customElement({
    name: "msft-tabs",
    template,
    styles,
})
export class MSFTTabs extends Tabs {}
export * from "./tab";
export * from "./tab-panel";
