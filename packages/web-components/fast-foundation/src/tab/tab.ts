import { attr, FASTElement } from "@microsoft/fast-element";
import { StartEnd, StartEndOptions } from "../patterns/index.js";
import { applyMixins } from "../utilities/apply-mixins.js";

/**
 * Tab option configuration options
 * @public
 */
export type TabOptionOptions = StartEndOptions;

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

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface FASTTab extends StartEnd {}
applyMixins(FASTTab, StartEnd);
