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
     * HTML Attribute: color
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

    public generateBadgeStyle = () => {
        if (!this.fill && !this.color) {
            return;
        }
        
        const fill: string = `background-color: var(--badge-fill-${this.fill});`;
        const color: string = `color: var(--badge-color-${this.color});`;

        if (this.fill && !this.color) {
            return fill;
        } else if (this.color && !this.fill) {
            return color;
        } else {
            return `${color} ${fill}`;
        }
    };
}
