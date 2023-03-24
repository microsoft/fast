import { attr, FASTElement } from "@microsoft/fast-element";
import { StartEnd } from "../patterns/start-end.js";
import type { StartEndOptions } from "../patterns/start-end.js";
import { applyMixins } from "../utilities/apply-mixins.js";

/**
 * Tab configuration options
 * @public
 */
export type TabOptions = StartEndOptions<FASTTab>;

/**
 * A Tab Component to be used with {@link @microsoft/fast-foundation#(FASTTabs:class)}
 *
 * @slot start - Content which can be provided before the tab content
 * @slot end - Content which can be provided after the tab content
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
