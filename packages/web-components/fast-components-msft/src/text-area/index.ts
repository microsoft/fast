import { customElement } from "@microsoft/fast-element";
import { TextAreaTemplate as template, TextArea } from "@microsoft/fast-components";
import { TextAreaStyles as styles } from "./text-area.styles.js";

@customElement({
    name: "msft-text-area",
    template,
    styles,
})
export class MSFTTextArea extends TextArea {}
