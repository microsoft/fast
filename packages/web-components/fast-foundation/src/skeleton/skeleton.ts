import { attr, FASTElement } from "@microsoft/fast-element";
import type { ValuesOf } from "../utilities/index.js";

/**
 * A structure representing skeleton shapes
 * @public
 */
export const SkeletonShape = {
    rect: "rect",
    circle: "circle",
} as const;

/**
 * @public
 */
export type SkeletonShape = ValuesOf<typeof SkeletonShape>;

/**
 * A Skeleton Custom HTML Element.
 *
 * @slot - The default slot
 *
 * @public
 */
export class FASTSkeleton extends FASTElement {
    /**
     * Indicates the Skeleton should have a filled style.
     *
     * @public
     * @remarks
     * HTML Attribute: fill
     */
    @attr
    public fill: string;

    /**
     * Indicates what the shape of the Skeleton should be.
     *
     * @public
     * @remarks
     * HTML Attribute: shape
     */
    @attr
    public shape: SkeletonShape = SkeletonShape.rect;

    /**
     * Indicates that the component can accept a pattern URL.
     *
     * @public
     * @remarks
     * HTML Attribute: pattern
     */
    @attr
    public pattern: string;

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
