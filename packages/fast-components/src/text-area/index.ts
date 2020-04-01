import { customElement } from "@microsoft/fast-element";
import { TextArea } from "./text-area";
import { TextAreaTemplate as template } from "./text-area.template";
import { TextAreaStyles as styles } from "./text-area.styles";
import { designSystemConsumer } from "../design-system-consumer";
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
    name: "fast-text-area",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
@designSystemConsumer({
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
export class FASTTextArea extends TextArea {}
export * from "./text-area.template";
export * from "./text-area.styles";
export * from "./text-area";
