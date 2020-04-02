import { customElement } from "@microsoft/fast-element";
import { Checkbox } from "./checkbox";
import { CheckboxTemplate as template } from "./checkbox.template";
import { CheckboxStyles as styles } from "./checkbox.styles";
import { designSystemConsumer } from "../design-system-consumer";
import {
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForegroundRest,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../styles/recipes";

@customElement({
    name: "fast-checkbox",
    template,
    styles,
})
@designSystemConsumer({
    recipes: [
        neutralOutlineRest,
        neutralFillInputRest,
        neutralForegroundRest,
        neutralFillInputHover,
        neutralOutlineHover,
    ],
})
export class FASTCheckbox extends Checkbox {}
export * from "./checkbox.template";
export * from "./checkbox.styles";
export * from "./checkbox";
