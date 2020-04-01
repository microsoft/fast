import { customElement } from "@microsoft/fast-element";
import { Checkbox } from "./checkbox";
import { CheckboxTemplate as template } from "./checkbox.template";
import { CheckboxStyles as styles } from "./checkbox.styles";
import { designSystemConsumer } from "../design-system-consumer";
import {
    neutralfillinputhover,
    neutralfillinputrest,
    neutralforegroundrest,
    neutraloutlinehover,
    neutraloutlinerest,
} from "../styles/recipes";

@customElement({
    name: "fast-checkbox",
    template,
    styles,
})
@designSystemConsumer({
    recipes: [
        neutraloutlinerest,
        neutralfillinputrest,
        neutralforegroundrest,
        neutralfillinputhover,
        neutraloutlinehover,
    ],
})
export class FASTCheckbox extends Checkbox {}
export * from "./checkbox.template";
export * from "./checkbox.styles";
export * from "./checkbox";
