import { customElement } from "@microsoft/fast-element";
import { TextArea, TextAreaTemplate as template } from "@microsoft/fast-foundation";
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
