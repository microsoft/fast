import { attr } from "@microsoft/fast-element";
import {
    Button as FoundationButton,
    buttonTemplate as template,
} from "@microsoft/fast-foundation";
import { buttonStyles as styles } from "./button.styles";

/**
 * Types of button appearance.
 * @public
 */
export type ButtonAppearance =
    | "accent"
    | "lightweight"
    | "neutral"
    | "outline"
    | "stealth";

/**
 * @internal
 */
export class Button extends FoundationButton {
    /**
     * The appearance the button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: ButtonAppearance;

    public connectedCallback() {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = "neutral";
        }
    }

    /**
     * Applies 'icon-only' class when there is only an SVG in the default slot
     *
     * @public
     * @remarks
     */
    public defaultSlottedContentChanged(oldValue, newValue): void {
        const slottedElements = this.defaultSlottedContent.filter(
            x => x.nodeType === Node.ELEMENT_NODE
        );
        if (slottedElements.length === 1 && slottedElements[0] instanceof SVGElement) {
            this.control.classList.add("icon-only");
        } else {
            this.control.classList.remove("icon-only");
        }
    }
}

/**
 * A function that returns a Button registration for configuring the component with a DesignSystem.
 * Implements Button
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace*/-button\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export const /* @echo namespace */Button = Button.compose({
    baseName: "button",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

/**
 * Styles for Button
 * @public
 */
export const buttonStyles = styles;
