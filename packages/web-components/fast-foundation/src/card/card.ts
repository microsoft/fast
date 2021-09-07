import { FoundationElement } from "../foundation-element";

/**
 * An Card Custom HTML Element.
 *
 * @public
 */
export class Card extends FoundationElement {
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        console.debug("cardConnected");
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        console.debug("cardDisconnected");
    }
}
