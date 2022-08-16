import { FASTElement } from "@microsoft/fast-element";
import { StartEnd, StartEndOptions } from "../patterns/index.js";
import { applyMixins } from "../utilities/apply-mixins.js";

/**
 * Badge configuration options
 * @public
 */
export type BadgeOptions = StartEndOptions;

/**
 * A Badge Custom HTML Element.
 * @slot - The default slot for the badge
 * @csspart control - The element representing the badge, which wraps the default slot
 *
 * @public
 */
export class FASTBadge extends FASTElement {}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface FASTBadge extends StartEnd {}
applyMixins(FASTBadge, StartEnd);
