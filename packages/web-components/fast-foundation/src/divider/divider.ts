import { attr, FASTElement } from "@microsoft/fast-element";
import { DividerRole } from "./divider.options";

export { DividerRole };

/**
 * A Divider Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#separator | ARIA separator } or {@link https://www.w3.org/TR/wai-aria-1.1/#presentation | ARIA presentation}.
 *
 * @public
 */
export class Divider extends FASTElement {
    /**
     * The role of the element.
     *
     * @public
     * @defaultValue - {@link DividerRole.separator}
     * @remarks
     * HTML Attribute: role
     */
    @attr
    public role: DividerRole = DividerRole.separator;
}
