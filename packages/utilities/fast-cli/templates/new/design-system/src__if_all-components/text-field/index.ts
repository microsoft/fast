import { attr } from "@microsoft/fast-element";
import {
    TextField as FoundationTextField,
    textFieldTemplate as template,
} from "@microsoft/fast-foundation";
import { textFieldStyles as styles } from "./text-field.styles";

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
    public appearance: TextFieldAppearance;

    /**
     * @internal
     */
    public connectedCallback() {
        super.connectedCallback();

        if (!this.appearance) {
            this.appearance = "outline";
        }
    }
}

/**
 * A function that returns a Text Fields registration for configuring the component with a DesignSystem.
 * Implements Text Fields
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-text-field\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export const /* @echo namespace */TextField = TextField.compose({
    baseName: "text-field",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

/**
 * Styles for TextField
 * @public
 */
export const textFieldStyles = styles;
