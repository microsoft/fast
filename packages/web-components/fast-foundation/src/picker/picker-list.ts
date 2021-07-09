import { FoundationElement } from "../foundation-element";

/**
 * A List Picker Menu Custom HTML Element.
 *
 * @public
 */
export class PickerList extends FoundationElement {

    /**
     *
     *
     * @public
     */
     public inputElement: HTMLInputElement;

    /**
     *
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
