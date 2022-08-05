import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element/foundation-element.js";

/**
 * A Tab Component to be used with {@link @microsoft/fast-foundation#(Tabs:class)}
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
