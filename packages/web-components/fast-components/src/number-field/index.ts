import { attr } from "@microsoft/fast-element";
import {
    NumberField as FoundationNumberField,
    NumberFieldOptions,
    numberFieldTemplate as template,
} from "@microsoft/fast-foundation";
import { numberFieldStyles as styles } from "./number-field.styles";

/**
 * Number field appearances
 * @public
 */
export type NumberFieldAppearance = "filled" | "outline";

/**
 * @internal
 */
export class NumberField extends FoundationNumberField {
    /**
     * The appearance of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: NumberFieldAppearance;

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
 * A function that returns a {@link @microsoft/fast-foundation#NumberField} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#numberFieldTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-number-field>`
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export const fastNumberField = NumberField.compose<NumberFieldOptions>({
    baseName: "number-field",
    baseClass: FoundationNumberField,
    styles,
    template,
    shadowOptions: {
        delegatesFocus: true,
    },
    stepDownGlyph: `
        <svg width="10" height="9" viewBox="0 0 10 9" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.79 3c-.4 0-.62.47-.35.78L4.5 6.14c.26.3.72.3.98 0l2.07-2.36A.47.47 0 0 0 7.21 3H2.8Z"/>
        </svg>
    `,
    stepUpGlyph: `
        <svg width="10" height="9" viewBox="0 0 10 9" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.79 6.37a.47.47 0 0 1-.35-.78L4.5 3.22c.26-.3.72-.3.98 0L7.56 5.6c.27.3.05.78-.35.78H2.8Z"/>
        </svg>
    `,
});

export { styles as numberFieldStyles };
