import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import type { VirtualList } from "..";
import { FoundationElement } from "../foundation-element";
import type { GalleryData, GallerySpanMap } from "./gallery-data";

/**
 *
 *
 * @public
 */
export class GalleryGroup extends FoundationElement {
    /**
     *
     *
     * @public
     */
    @observable
    public galleryData: GalleryData;
    private galleryDataChanged(): void {
        if (this.$fastController.isConnected) {
            this.galleriesListElement.items = this.galleryData.items as GalleryData[];
        }
    }

    /**
     *
     *
     * @public
     */
    @observable
    public spanmap: GallerySpanMap[] = [];
    private spanmapChanged(): void {
        if (this.$fastController.isConnected) {
            this.galleriesListElement.spanmap = this.spanmap;
        }
    }

    public galleriesListElement: VirtualList;

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
        this.galleriesListElement.viewportElement = document.documentElement;
        this.galleriesListElement.items = this.galleryData.items as GalleryData[];
        this.galleriesListElement.spanmap = this.spanmap;
    }
}
