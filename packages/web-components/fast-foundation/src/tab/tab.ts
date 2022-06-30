import { attr, FASTElement } from "@microsoft/fast-element";

/**
 * A Tab Component to be used with {@link @microsoft/fast-foundation#(FASTTabs:class)}
 *
 * @slot - The default slot for the tab content
 *
 * @public
 */
export class FASTTab extends FASTElement {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled | disabled HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;
}
