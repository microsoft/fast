import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element/foundation-element.js";

/**
 * A Badge Custom HTML Element.
 * @slot - The default slot for the badge
 * @csspart control - The element representing the badge, which wraps the default slot
 *
 * @public
 */
export class Badge extends FoundationElement {
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
