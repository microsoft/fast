import { customElement } from "@microsoft/fast-element";
import { designSystemConsumer } from "../design-system-consumer";
import {
    neutralFillHover,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../styles/recipes";
import { TextField } from "./text-field";
import { TextFieldTemplate as template } from "./text-field.template";
import { TextFieldStyles as styles } from "./text-field.styles";

@customElement({
    name: "fast-text-field",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
@designSystemConsumer({
    recipes: [
        neutralForegroundRest,
        neutralFillInputRest,
        neutralOutlineRest,
        neutralFillInputHover,
        neutralOutlineHover,
        neutralFocus,
        neutralFillRest,
        neutralFillHover,
    ],
})
export class FASTTextField extends TextField {}
export * from "./text-field.template";
export * from "./text-field.styles";
export * from "./text-field";
