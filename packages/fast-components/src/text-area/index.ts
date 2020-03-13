import { customElement } from "@microsoft/fast-element";
import { TextArea } from "./text-area";
import { TextAreaTemplate as template } from "./text-area.template";
import { TextAreaStyles as styles } from "./text-area.styles";

@customElement({
    name: "fast-text-area",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTTextArea extends TextArea {}
export * from "./text-area.template";
export * from "./text-area.styles";
export * from "./text-area";
