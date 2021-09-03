import { attr } from "@microsoft/fast-element";
import {
    TextArea as FoundationTextArea,
    textAreaTemplate as template,
} from "@microsoft/fast-foundation";
import { textAreaStyles as styles } from "./text-area.styles";

/**
 * Text area appearances
 * @public
 */
export type TextAreaAppearance = "filled" | "outline";

/**
 * @internal
 */
export class TextArea extends FoundationTextArea {
    /**
     * The appearance of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: TextAreaAppearance;

    /**
     * @internal
     */
    public appearanceChanged(
        oldValue: TextAreaAppearance,
        newValue: TextAreaAppearance
    ): void {
        if (oldValue !== newValue) {
            this.classList.add(newValue);
            this.classList.remove(oldValue);
        }
    }

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
