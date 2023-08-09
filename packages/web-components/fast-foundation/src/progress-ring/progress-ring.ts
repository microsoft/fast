import { FASTBaseProgress } from "../progress/base-progress.js";

/**
 * An circular Progress HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#progressbar | ARIA progressbar }.
 *
 * @slot determinate - The slot for the determinate indicator
 * @slot indeterminate - The slot for the indeterminate indicator
 * @csspart determinate - The determinate indicator
 * @csspart indeterminate - The indeterminate indicator
 *
 * @public
 */
export class FASTProgressRing extends FASTBaseProgress {}
