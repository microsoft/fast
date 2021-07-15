import { FoundationElement } from "../foundation-element";
/**
 * A structure representing skeleton shapes
 * @public
 */
export declare type SkeletonShape = "rect" | "circle";
/**
 * A Skeleton Custom HTML Element.
 *
 * @public
 */
export declare class Skeleton extends FoundationElement {
    /**
     * Indicates the Skeleton should have a filled style.
     *
     * @public
     * @remarks
     * HTML Attribute: fill
     */
    fill: string;
    /**
     * Indicates what the shape of the Skeleton should be.
     *
     * @public
     * @remarks
     * HTML Attribute: shape
     */
    shape: SkeletonShape;
    /**
     * Indicates that the component can accept a pattern URL.
     *
     * @public
     * @remarks
     * HTML Attribute: shape
     */
    pattern: string;
    /**
     * Indicates that the component has an activated shimmer effect
     *
     * @public
     * @remarks
     * HTML Attribute: shimmer
     */
    shimmer: boolean;
}
