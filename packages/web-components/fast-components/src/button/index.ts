import { customElement } from "@microsoft/fast-element";
import { Button } from "./button";
import { ButtonTemplate as template } from "./button.template";
import { ButtonStyles as styles } from "./button.styles";

// Button
@customElement({
    name: "fast-button",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTButton extends Button {}
export * from "./button.template";
export * from "./button.styles";
export * from "./button";
