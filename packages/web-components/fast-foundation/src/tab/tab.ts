import { attr } from "@ni/fast-element";
import { FoundationElement } from "../foundation-element/foundation-element.js";

/**
 * A Tab Component to be used with {@link @ni/fast-foundation#(Tabs:class)}
 *
 * @slot - The default slot for the tab content
 *
 * @public
 */
export class Tab extends FoundationElement {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled | disabled HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;
}
