import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import type { VirtualList } from "..";
import { FoundationElement } from "../foundation-element";

export interface GalleryItemData {
    /**
     *
     */
    title: string;

    /**
     *
     */
    image: string;
}

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
    public galleryItemData: GalleryItemData;
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
