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
    TextArea as FoundationTextArea,
    textAreaTemplate as template,
} from "@microsoft/fast-foundation";
import { textAreaStyles as styles } from "./text-area.styles";
/**
 * @internal
 */
export class TextArea extends FoundationTextArea {
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
__decorate([attr], TextArea.prototype, "appearance", void 0);
/**
 * A function that returns a {@link @microsoft/fast-foundation#TextArea} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#textAreaTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-text-area\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export const fastTextArea = TextArea.compose({
    baseName: "text-area",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
/**
 * Styles for TextArea
 * @public
 */
export const textAreaStyles = styles;
