import { customElement } from "@microsoft/fast-element";
import { Button, ButtonTemplate as template } from "@microsoft/fast-foundation";
import { ButtonStyles as styles } from "./button.styles";

/**
 * The FAST Button Element. Implements {@link @microsoft/fast-foundation#Button},
 * {@link @microsoft/fast-foundation#ButtonTemplate}
 * 
 * 
 * @public
 * @remarks
 * HTML Element: \<fast-button\>
 */
@customElement({
    name: "fast-button",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTButton extends Button {}
