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
        <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.08 4.62A1 1 0 0 1 4 4h4a1 1 0 0 1 .7 1.7l-2 2a1 1 0 0 1-1.4 0l-2-2a1 1 0 0 1-.22-1.08Z"/>
        </svg>
    `,
    stepUpGlyph: /* html */ `
        <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.08 7.38A1 1 0 0 0 4 8h4a1 1 0 0 0 .7-1.7l-2-2a1 1 0 0 0-1.4 0l-2 2a1 1 0 0 0-.22 1.08Z"/>
        </svg>
    `,
});

export { styles as numberFieldStyles };
