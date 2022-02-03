import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import type { GalleryGroup } from "./gallery-group";
import type { GalleryData, GallerySpanMap } from "./gallery-data";

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
    public galleryData: GalleryData;
    private galleryDataChanged(): void {
        if (this.$fastController.isConnected) {
            this.galleryGroupElement.galleryData = this.galleryData;
            this.updateSpanMap(this.galleryData.items as GalleryData[]);
        }
    }

    public galleryGroupElement: GalleryGroup;

    private galleryHeight: number = 370;
    private galleryGroupHeaderHeight: number = 40;

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
        this.galleryGroupElement.galleryData = this.galleryData;
        this.updateSpanMap(this.galleryData.items as GalleryData[]);
    }

    private updateSpanMap(items: GalleryData[]): void {
        const newSpanMap: GallerySpanMap[] = this.getSpanMap(items);
        this.galleryGroupElement.spanmap = newSpanMap;
    }

    private getSpanMap(items: GalleryData[]): GallerySpanMap[] {
        const newSpanMap: GallerySpanMap[] = [];
        const itemCount: number = items.length;
        let currentPosition: number = 0;

        for (let i = 0; i <= itemCount; i++) {
            const start: number = currentPosition;
            const thisItem = items[i];
            let children: GallerySpanMap[] = [];

            switch (thisItem?.galleryType) {
                case "gallery":
                    currentPosition = currentPosition + this.galleryHeight;
                    newSpanMap.push({
                        start,
                        end: currentPosition,
                        span: this.galleryHeight,
                    });
                    break;

                case "gallery-group":
                    currentPosition = currentPosition + this.galleryGroupHeaderHeight;
                    children = this.getSpanMap(thisItem.items as GalleryData[]);
                    if (children.length > 0) {
                        currentPosition =
                            currentPosition + children[children.length - 1].end;
                    }
                    newSpanMap.push({
                        start,
                        end: currentPosition,
                        span: currentPosition - start,
                        children,
                    });
                    break;
            }
        }

        return newSpanMap;
    }
}
