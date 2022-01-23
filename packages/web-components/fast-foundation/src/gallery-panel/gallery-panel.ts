import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
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

    /**
     *
     *
     * @internal
     */
    public testButton: HTMLElement;

    public connectedCallback(): void {
        super.connectedCallback();
        this.testButton.textContent = "BOO";
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }
}
