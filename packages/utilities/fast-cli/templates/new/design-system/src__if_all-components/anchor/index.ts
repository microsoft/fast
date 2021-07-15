import { attr } from "@microsoft/fast-element";
import {
    Anchor as FoundationAnchor,
    anchorTemplate as template,
} from "@microsoft/fast-foundation";
import { ButtonAppearance } from "../button";
import { anchorStyles as styles } from "./anchor.styles";

/**
 * Types of anchor appearance.
 * @public
 */
export type AnchorAppearance = ButtonAppearance | "hypertext";

/**
 * Base class for Anchor
 * @public
 */
export class Anchor extends FoundationAnchor {
    /**
     * The appearance the anchor should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: AnchorAppearance;
    public appearanceChanged(
        oldValue: AnchorAppearance,
        newValue: AnchorAppearance
    ): void {
        if (oldValue !== newValue) {
            this.classList.add(newValue);
            this.classList.remove(oldValue);
        }
    }

    public connectedCallback() {
        super.connectedCallback();

        if (!this.appearance) {
            this.appearance = "neutral";
        }
    }

    /**
     * Applies 'icon-only' class when there is only an SVG in the default slot
     *
     * @internal
     *
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
 * Styles for Anchor
 * @public
 */
export const anchorStyles = styles;

/**
 * A function that returns a Anchor registration for configuring the component with a DesignSystem.
 * Implements Anchor
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-anchor\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export const /* @echo namespace */Anchor = Anchor.compose({
    baseName: "anchor",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
