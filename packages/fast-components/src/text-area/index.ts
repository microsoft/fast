import { customElement } from "@microsoft/fast-element";
import { TextArea } from "./text-area";
import { TextAreaTemplate as template } from "./text-area.template";
import { TextAreaStyles as styles } from "./text-area.styles";
import { consumer } from "../design-system-provider/design-system-consumer";
import {
    neutralforegroundrest,
    neutralfillinputrest,
    neutraloutlinerest,
    neutralfillinputhover,
    neutraloutlinehover,
    neutralfocus,
    neutralfillrest,
    neutralfillhover,
} from "../styles/recipes";

@customElement({
    name: "fast-text-area",
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
export class FASTTextArea extends TextArea {}
export * from "./text-area.template";
export * from "./text-area.styles";
export * from "./text-area";
