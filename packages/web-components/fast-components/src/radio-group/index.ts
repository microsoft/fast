import { customElement } from "@microsoft/fast-element";
import { RadioGroup, RadioGroupTemplate as template } from "@microsoft/fast-foundation";
import { RadioGroupStyles as styles } from "./radio-group.styles.js";

@customElement({
    name: "fast-radio-group",
    template,
    styles,
})
export class FASTRadioGroup extends RadioGroup {}
