import { customElement } from "@microsoft/fast-element";
import { Checkbox } from "./checkbox";
import { CheckboxTemplate as template } from "./checkbox.template";
import { CheckboxStyles as styles } from "./checkbox.styles";

@customElement({
    name: "fast-checkbox",
    template,
    styles,
    shadowOptions: {
        mode: "open",
        delegatesFocus: true,
    },
})
export class FASTCheckbox extends Checkbox {}
export * from "./checkbox.template";
export * from "./checkbox.styles";
export * from "./checkbox";
