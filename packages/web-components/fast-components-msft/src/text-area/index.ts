import { customElement } from "@microsoft/fast-element";
import { TextArea, TextAreaTemplate as template } from "@microsoft/fast-components";
import { TextAreaStyles as styles } from "./text-area.styles";

@customElement({
    name: "msft-text-area",
    template,
    styles,
})
export class MSFTTextArea extends TextArea {}
