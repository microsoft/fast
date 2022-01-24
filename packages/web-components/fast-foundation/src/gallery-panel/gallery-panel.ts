import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import type { VirtualList } from "..";
import { FoundationElement } from "../foundation-element";

/**
 *
 *
 * @public
 */
export interface GalleryPanelData {
    /**
     *
     */
    title: string;

    /**
     *
     */
    galleries: GalleryData[];
}

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
export class GalleryPanel extends FoundationElement {
    /**
     *
     *
     * @public
     */
    @observable
    public panelData: GalleryPanelData;
    private panelDataChanged(): void {
        if (this.$fastController.isConnected) {
            this.galleryListElement.items = this.panelData.galleries;
        }
    }

    public galleryListElement: VirtualList;

    public connectedCallback(): void {
        super.connectedCallback();
        DOM.queueUpdate(() => {
            this.initialize();
        });
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    private initialize(): void {
        this.galleryListElement.viewportElement = document.documentElement;
    }
}
