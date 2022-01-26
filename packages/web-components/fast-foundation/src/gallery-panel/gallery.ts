import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import type { VirtualList } from "..";
import { FoundationElement } from "../foundation-element";
import type { GalleryItemData } from "./gallery-item";

/**
 *
 *
 * @public
 */
export interface GalleryData {
    /**
     *
     */
    title: string;

    /**
     *
     */
    items: GalleryItemData[];
}

/**
 *
 *
 * @public
 */
export class Gallery extends FoundationElement {
    /**
     *
     *
     * @public
     */
    @observable
    public galleryData: GalleryData;
    private galleryDataChanged(): void {
        if (this.$fastController.isConnected) {
            this.galleryListElement.items = this.galleryData.items;
        }
    }

    public galleryListElement: VirtualList;

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }
}
