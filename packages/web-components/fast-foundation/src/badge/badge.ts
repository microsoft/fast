import { attr, FASTElement } from "@microsoft/fast-element";

/**
 * A Badge Custom HTML Element.
 *
 * @public
 */
export class Badge extends FASTElement {
    /**
     * Indicates the badge should have a filled style.
     * @public
     * @remarks
     * HTML Attribute: fill
     */
    @attr({ attribute: "fill" })
    public fill: string;

    /**
     * Indicates the badge should have a filled style.
     *
     * @public
     * @remarks
     * HTML Attribute: fill
     * @privateRemarks
     * Revisit this once we have a better story for ensuring proper contrast from author defined `fill`
     */
    @attr({ attribute: "color" })
    public color: string;

    /**
     * Indicates the element should be circular
     *
     * @public
     * @remarks
     * HTML Attribute: circular
     */
    @attr({ mode: "boolean" })
    public circular: boolean;
}
