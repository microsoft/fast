import { customElement } from "@microsoft/fast-element";
import { Tab, TabTemplate as template } from "@microsoft/fast-components";
import { TabStyles as styles } from "./tab.styles";

@customElement({
    name: "fast-tab",
    template,
    styles,
})
export class FASTTab extends Tab {}
