import { customElement } from "@microsoft/fast-element";
import { TextField, TextFieldTemplate as template } from "@microsoft/fast-components";
import { TextFieldStyles as styles } from "./text-field.styles";

@customElement({
    name: "msft-text-field",
    template,
    styles,
})
export class MSFTTextField extends TextField {}
