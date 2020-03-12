import { customElement } from "@microsoft/fast-element";
import { TextField } from "./text-field";
import { TextFieldTemplate as template } from "./text-field.template";
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
export * from "./text-field.template";
export * from "./text-field.styles";
export * from "./text-field";
