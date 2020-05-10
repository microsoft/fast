import { customElement } from "@microsoft/fast-element";
import { Button, ButtonTemplate as template } from "@microsoft/fast-components";
import { ButtonStyles as styles } from "./button.styles";

// Button
@customElement({
    name: "msft-button",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class MSFTButton extends Button {}
