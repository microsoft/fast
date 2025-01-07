import { attr } from "@ni/fast-element";
import { Orientation } from "@ni/fast-web-utilities";
import { FoundationElement } from "../foundation-element/foundation-element.js";
import { DividerRole } from "./divider.options.js";

export { DividerRole };

/**
 * A Divider Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#separator | ARIA separator } or {@link https://www.w3.org/TR/wai-aria-1.1/#presentation | ARIA presentation}.
 *
 * @public
 */
export class Divider extends FoundationElement {
    /**
     * The role of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: role
     */
    @attr
    public role: DividerRole = DividerRole.separator;

    /**
     * The orientation of the divider.
     *
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    @attr
    public orientation: Orientation = Orientation.horizontal;
}
