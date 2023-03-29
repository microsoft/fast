import { attr } from "@microsoft/fast-element";
import {
    FASTAnchor as FoundationAnchor,
    anchorTemplate as template,
} from "@microsoft/fast-foundation";
import { anchorStyles as styles } from "./anchor.styles.js";
/**
 * Base class for Anchor
 * @public
 */
export class Anchor extends FoundationAnchor {
    @attr
    public appearance: undefined | string;
    appearanceChanged(oldValue: any, newValue: any) {
        if (this.$fastController.isConnected) {
            this.classList.remove(oldValue);
            this.classList.add(newValue);
        }
    }
    connectedCallback() {
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
    defaultSlottedContentChanged(oldValue: any, newValue: any) {
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
 * A function that returns a {@link @microsoft/fast-foundation#Anchor} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#anchorTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-anchor>`
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export const fastAnchor = Anchor.compose({
    name: "fast-anchor",
    styles,
    template: template(),
});
export { styles as anchorStyles };
