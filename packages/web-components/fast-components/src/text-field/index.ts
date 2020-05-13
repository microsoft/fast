import { customElement } from "@microsoft/fast-element";
import { TextField, TextFieldTemplate as template } from "@microsoft/fast-foundation";
import { TextFieldStyles as styles } from "./text-field.styles";

@customElement({
    name: "fast-text-field",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTTextField extends TextField {}
