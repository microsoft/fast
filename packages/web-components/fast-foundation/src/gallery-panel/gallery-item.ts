import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import type { VirtualList } from "..";
import { FoundationElement } from "../foundation-element";
import type { GalleryData } from "./gallery-data";

/**
 *
 *
 * @public
 */
export class GalleryItem extends FoundationElement {
    /**
     *
     *
     * @public
     */
    @observable
    public galleryItemData: GalleryData;
    // private galleryItemDataChanged(): void {
    //     if (this.$fastController.isConnected) {
    //         this.galleryListElement.items = this.galleryItemData.items;
    //     }
    // }

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }
}
