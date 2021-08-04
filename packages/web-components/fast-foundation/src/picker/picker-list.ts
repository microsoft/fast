import { attr } from "@microsoft/fast-element";

import { FoundationElement } from "../foundation-element";

/**
 * A List Picker Menu Custom HTML Element.
 *
 * @public
 */
export class PickerList extends FoundationElement {
    /**
     * Applied to the aria-label attribute of the input element
     *
     * @public
     * @remarks
     * HTML Attribute: label
     */
    @attr({ attribute: "label" })
    public label: string;

    /**
     * Applied to the aria-labelledby attribute of the input element
     *
     * @public
     * @remarks
     * HTML Attribute: labelledby
     */
    @attr({ attribute: "labelledby" })
    public labelledby: string;

    /**
     * The input element of the component
     *
     * @public
     */
    public inputElement: HTMLInputElement;

    /**
     *  Reference to the placeholder element for the repeat directive
     *
     * @public
     */
    public itemsPlaceholderElement: Node;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.itemsPlaceholderElement = document.createComment("");
        this.prepend(this.itemsPlaceholderElement);
    }
}
