import { attr, FASTElement } from "@microsoft/fast-element";

/**
 * A structure representing skeleton shapes
 * @public
 */
export type SkeletonShape = "rect" | "circle";

/**
 * A Skeleton Custom HTML Element.
 *
 * @public
 */
export class Skeleton extends FASTElement {
    /**
     * Indicates the Skeleton should have a filled style.
     *
     * @public
     * @remarks
     * HTML Attribute: fill
     */
    @attr public fill: string;

    /**
     * Indicates what the shape of the Skeleton should be.
     *
     * @public
     * @remarks
     * HTML Attribute: shape
     */
    @attr public shape: SkeletonShape = "rect";

    /**
     * Indicates that the component can accept a pattern URL.
     *
     * @public
     * @remarks
     * HTML Attribute: shape
     */
    @attr public pattern: string;

    /**
     * Indicates that the component has an activated shimmer effect
     *
     * @public
     * @remarks
     * HTML Attribute: shimmer
     */
    @attr({ mode: "boolean" })
    public shimmer: boolean;
}
