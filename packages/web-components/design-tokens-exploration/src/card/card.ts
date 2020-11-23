import { attr } from "@microsoft/fast-element";
import { DesignTokenProvider, FoundationElement } from "@microsoft/fast-foundation";
import { CardBackground } from "./card.background";

/**
 * An Card Custom HTML Element.
 *
 * @public
 */
export class Card extends DesignTokenProvider(FoundationElement) {
    @attr({ attribute: "background-color" })
    backgroundColor: string;

    backgroundColorChanged(prev, next) {
        this.designTokens.set("backgroundColor", next);
    }

    connectedCallback() {
        super.connectedCallback();
        this.$fastController.addBehaviors([new CardBackground()]);
    }
}
