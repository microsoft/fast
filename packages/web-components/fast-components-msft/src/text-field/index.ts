import { customElement } from "@microsoft/fast-element";
import { TextFieldTemplate as template, TextField } from "@microsoft/fast-components";
import { TextFieldStyles as styles } from "./text-field.styles";

@customElement({
    name: "fast-text-field",
    template,
    styles,
})
export class FASTTextField extends TextField {}
