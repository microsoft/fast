import { customElement } from "@microsoft/fast-element";
import { TextAreaTemplate as template, TextArea } from "@microsoft/fast-components";
import { TextAreaStyles as styles } from "./text-area.styles";

@customElement({
    name: "fast-text-area",
    template,
    styles,
})
export class FASTTextArea extends TextArea {}
