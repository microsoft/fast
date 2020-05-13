import { customElement } from "@microsoft/fast-element";
import { Divider, DividerTemplate as template } from "@microsoft/fast-components";
import { DividerStyles as styles } from "./divider.styles";

@customElement({
    name: "fast-divider",
    template,
    styles,
})
export class FASTDivider extends Divider {}
