var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { attr } from "@microsoft/fast-element";
import {
    NumberField as FoundationNumberField,
    numberFieldTemplate as template,
} from "@microsoft/fast-foundation";
import { numberFieldStyles as styles } from "./number-field.styles";
/**
 * @internal
 */
export class NumberField extends FoundationNumberField {
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = "outline";
        }
    }
}
__decorate([attr], NumberField.prototype, "appearance", void 0);
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
export const fastNumberField = NumberField.compose({
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
