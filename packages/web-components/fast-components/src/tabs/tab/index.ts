import { customElement } from "@microsoft/fast-element";
import { Tab, TabTemplate as template } from "@microsoft/fast-foundation";
import { TabStyles as styles } from "./tab.styles.js";

@customElement({
    name: "fast-tab",
    template,
    styles,
})
export class FASTTab extends Tab {}
