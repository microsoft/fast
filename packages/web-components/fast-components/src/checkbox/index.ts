import { customElement } from "@microsoft/fast-element";
import { Checkbox, CheckboxTemplate as template } from "@microsoft/fast-foundation";
import { CheckboxStyles as styles } from "./checkbox.styles.js";

@customElement({
    name: "fast-checkbox",
    template,
    styles,
})
export class FASTCheckbox extends Checkbox {}
