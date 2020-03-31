import { customElement } from "@microsoft/fast-element";
import { Checkbox } from "./checkbox";
import { CheckboxTemplate as template } from "./checkbox.template";
import { CheckboxStyles as styles } from "./checkbox.styles";
import { consumer } from "../design-system-provider/design-system-consumer";
import {
    neutraloutlinerest,
    neutralfillinputrest,
    neutralforegroundrest,
    neutralfillinputhover,
    neutraloutlinehover,
} from "../styles/recipes";

@customElement({
    name: "fast-checkbox",
    template,
    styles,
})
@consumer({
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
