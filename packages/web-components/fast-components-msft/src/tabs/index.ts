import { customElement } from "@microsoft/fast-element";
import { Tabs, TabsTemplate as template } from "@microsoft/fast-components";
import { TabsStyles as styles } from "./tabs.styles";

@customElement({
    name: "fast-tabs",
    template,
    styles,
})
export class FASTTabs extends Tabs {}
export * from "./tab/";
export * from "./tab-panel/";
