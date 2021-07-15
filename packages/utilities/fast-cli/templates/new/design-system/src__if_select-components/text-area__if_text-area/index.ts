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
    public connectedCallback() {
        super.connectedCallback();

        if (!this.appearance) {
            this.appearance = "outline";
        }
    }
}

/**
 * A function that returns a Text Area registration for configuring the component with a DesignSystem.
 * Implements Text Area
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-text-area\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export const /* @echo namespace */TextArea = TextArea.compose({
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
