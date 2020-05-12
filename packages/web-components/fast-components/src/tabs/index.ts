import { customElement } from "@microsoft/fast-element";
import { Tabs } from "./tabs";
import { TabsTemplate as template } from "./tabs.template";
import { TabsStyles as styles } from "./tabs.styles";

@customElement({
    name: "fast-tabs",
    template,
    styles,
})
export class FASTTabs extends Tabs {}
export * from "./tabs.template";
export * from "./tabs.styles";
export * from "./tabs";
export * from "./tab";
export * from "./tab-panel";
