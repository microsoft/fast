import { customElement } from "@microsoft/fast-element";
import { TextArea } from "./text-area";
import { TextAreaTemplate as template } from "./text-area.template";
import { TextAreaStyles as styles } from "./text-area.styles";
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
export class FASTTextArea extends TextArea {}
export * from "./text-area.template";
export * from "./text-area.styles";
export * from "./text-area";
