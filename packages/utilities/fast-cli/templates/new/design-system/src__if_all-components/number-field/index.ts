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
 * A function that returns a Number Field registration for configuring the component with a DesignSystem.
 * Implements Number Field
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-number-field\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export const /* @echo namespace */NumberField = NumberField.compose<NumberFieldOptions>({
    baseName: "number-field",
    styles,
    template,
    shadowOptions: {
        delegatesFocus: true,
    },
    stepDownGlyph: `
        <span class="step-down-glyph" part="step-down-glyph"></span>
    `,
    stepUpGlyph: `
        <span class="step-up-glyph" part="step-up-glyph"></span>
    `,
});
