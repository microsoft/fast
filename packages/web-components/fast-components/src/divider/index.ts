import { customElement } from "@microsoft/fast-element";
import { Divider, DividerTemplate as template } from "@microsoft/fast-foundation";
import { DividerStyles as styles } from "./divider.styles.js";

@customElement({
    name: "fast-divider",
    template,
    styles,
})
export class FASTDivider extends Divider {}
