import { customElement } from "@microsoft/fast-element";
import { RadioGroup } from "./radio-group";
import { RadioGroupTemplate as template } from "./radio-group.template";
import { RadioGroupStyles as styles } from "./radio-group.styles";

@customElement({
    name: "fast-radio-group",
    template,
    styles,
})
export class FASTRadioGroup extends RadioGroup {}
export * from "./radio-group.template";
export * from "./radio-group.styles";
export * from "./radio-group";
