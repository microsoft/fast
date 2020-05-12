import { customElement } from "@microsoft/fast-element";
import { Checkbox, CheckboxTemplate as template } from "@microsoft/fast-components";
import { CheckboxStyles as styles } from "./checkbox.styles.js";

@customElement({
    name: "msft-checkbox",
    template,
    styles,
})
export class MSFTCheckbox extends Checkbox {}
