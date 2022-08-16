import { FASTElement } from "@microsoft/fast-element";
import { StartEnd } from "../patterns/start-end.js";
import type { StartEndOptions } from "../patterns/start-end.js";
import { applyMixins } from "../utilities/apply-mixins.js";

/**
 * Badge configuration options
 * @public
 */
export type BadgeOptions = StartEndOptions;

/**
 * A Badge Custom HTML Element.
 * @slot start - Content which can be provided before the default slot
 * @slot end - Content which can be provided after the default slot
 * @slot - The default slot for the badge
 * @csspart content - The element representing the badge, which wraps the default slot
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
