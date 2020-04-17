import { customElement } from "@microsoft/fast-element";
import { Tab } from "./tab";
import { TabTemplate as template } from "./tab.template";
import { TabStyles as styles } from "./tab.styles";

@customElement({
    name: "fast-tab",
    template,
    styles,
})
export class FASTTab extends Tab {}
export * from "./tab.template";
export * from "./tab.styles";
export * from "./tab";
