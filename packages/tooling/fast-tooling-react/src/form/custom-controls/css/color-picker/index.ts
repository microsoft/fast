import { customElement } from "@microsoft/fast-element";
import { ColorPicker } from "./color-picker";
import { ColorPickerTemplate as template } from "./color-picker.template";

import { colorPickerStyles as styles } from "./color-picker.styles";

/**
 *
 * @public
 * @remarks
 * HTML Element: \<color-picker\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
@customElement({
    name: "color-picker",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTColorPicker extends ColorPicker {
    /**
     * @internal
     */
    public connectedCallback() {
        super.connectedCallback();
    }
}
