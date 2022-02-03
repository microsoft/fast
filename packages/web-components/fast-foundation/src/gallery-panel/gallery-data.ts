import type { SpanMap } from "../virtual-list";

/**
 *
 *
 * @public
 */
export type GalleryType = "gallery-group" | "gallery" | "gallery-item";

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
    galleryType: GalleryType;

    /**
     *
     */
    items?: GalleryData[];

    /**
     *
     */
    image?: string;
}

export interface GallerySpanMap extends SpanMap {
    children?: SpanMap[];
}
