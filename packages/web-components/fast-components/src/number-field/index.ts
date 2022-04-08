import { attr } from "@microsoft/fast-element";
import {
    NumberField as FoundationNumberField,
    NumberFieldOptions,
    numberFieldTemplate as template,
} from "@microsoft/fast-foundation";
import { numberFieldStyles as styles } from "./number-field.styles.js";

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
    public appearance: NumberFieldAppearance = "outline";
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
    stepDownGlyph: /* html */ `
        <span class="step-down-glyph" part="step-down-glyph"></span>
    `,
    stepUpGlyph: /* html */ `
        <span class="step-up-glyph" part="step-up-glyph"></span>
    `,
});

export { styles as numberFieldStyles };
