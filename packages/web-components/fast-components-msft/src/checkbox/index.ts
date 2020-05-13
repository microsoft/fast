import { customElement } from "@microsoft/fast-element";
import { Checkbox, CheckboxTemplate as template } from "@microsoft/fast-components";
import { CheckboxStyles as styles } from "./checkbox.styles";

@customElement({
    name: "fast-checkbox",
    template,
    styles,
})
export class FASTCheckbox extends Checkbox {}
