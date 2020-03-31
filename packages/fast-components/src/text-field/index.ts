import { customElement } from "@microsoft/fast-element";
import { TextField } from "./text-field";
import { TextFieldTemplate as template } from "./text-field.template";
import { TextFieldStyles as styles } from "./text-field.styles";
import { consumer } from "../design-system-provider/design-system-consumer";
import {
    neutralfillhover,
    neutralfillinputhover,
    neutralfillinputrest,
    neutralfillrest,
    neutralfocus,
    neutralforegroundrest,
    neutraloutlinehover,
    neutraloutlinerest,
} from "../styles/recipes";

@customElement({
    name: "fast-text-field",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
@consumer({
    recipes: [
        neutralforegroundrest,
        neutralfillinputrest,
        neutraloutlinerest,
        neutralfillinputhover,
        neutraloutlinehover,
        neutralfocus,
        neutralfillrest,
        neutralfillhover,
    ],
})
export class FASTTextField extends TextField {}
export * from "./text-field.template";
export * from "./text-field.styles";
export * from "./text-field";
