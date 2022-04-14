import { attr } from "@microsoft/fast-element";
import {
    TextField as FoundationTextField,
    textFieldTemplate as template,
} from "@microsoft/fast-foundation";
import { textFieldStyles as styles } from "./text-field.styles.js";

/**
 * Text field appearances
 * @public
 */
export type TextFieldAppearance = "filled" | "outline";

/**
 * @internal
 */
export class TextField extends FoundationTextField {
    /**
     * The appearance of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: TextFieldAppearance = "outline";
}

/**
 * A function that returns a {@link @microsoft/fast-foundation#TextField} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#textFieldTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-text-field>`
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export const fastTextField = TextField.compose({
    baseName: "text-field",
    baseClass: FoundationTextField,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

export { styles as textFieldStyles };
