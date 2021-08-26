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
 * Styles for NumberField
 * @public
 */
export const numberFieldStyles = styles;

/**
 * A function that returns a {@link @microsoft/fast-foundation#NumberField} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#numberFieldTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-number-field\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export const fastNumberField = NumberField.compose<NumberFieldOptions>({
    baseName: "number-field",
    styles,
    template,
    shadowOptions: {
        delegatesFocus: true,
    },
    stepDownGlyph: `
    <svg width="10" height="9" viewBox="0 0 10 9" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.78802 3C2.38529 3 2.17005 3.47434 2.43525 3.77741L4.50592 6.14392C4.7674 6.44272 5.23222 6.44272 5.4937 6.14392L7.56438 3.77741C7.82958 3.47434 7.61433 3 7.21162 3H2.78802Z"/>
    </svg>

    `,
    stepUpGlyph: `
    <svg width="10" height="9" viewBox="0 0 10 9" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.78802 6.36803C2.38529 6.36803 2.17005 5.89369 2.43525 5.59061L4.50592 3.22412C4.7674 2.92531 5.23222 2.92531 5.4937 3.22412L7.56438 5.59061C7.82958 5.89369 7.61433 6.36803 7.21162 6.36803H2.78802Z"/>
    </svg>
    `,
});
