import { customElement } from "@microsoft/fast-element";
import { Tab, TabTemplate as template } from "@microsoft/fast-components";
import { TabStyles as styles } from "./tab.styles";

@customElement({
    name: "msft-tab",
    template,
    styles,
})
export class MSFTTab extends Tab {}
