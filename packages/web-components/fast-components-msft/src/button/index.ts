import { customElement } from "@microsoft/fast-element";
import { Button } from "@microsoft/fast-components";
// update the below once #3091 is merged
import { ButtonTemplate as template } from "@microsoft/fast-components/dist/button/button.template";
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
