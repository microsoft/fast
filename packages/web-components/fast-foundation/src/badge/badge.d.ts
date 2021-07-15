import { FoundationElement } from "../foundation-element";
/**
 * A Badge Custom HTML Element.
 *
 * @public
 */
export declare class Badge extends FoundationElement {
    /**
     * Indicates the badge should have a filled style.
     * @public
     * @remarks
     * HTML Attribute: fill
     */
    fill: string;
    /**
     * Indicates the badge should have a filled style.
     *
     * @public
     * @remarks
     * HTML Attribute: color
     * @privateRemarks
     * Revisit this once we have a better story for ensuring proper contrast from author defined `fill`
     */
    color: string;
    /**
     * Indicates the element should be circular
     *
     * @public
     * @remarks
     * HTML Attribute: circular
     */
    circular: boolean;
    generateBadgeStyle: () => string;
}
