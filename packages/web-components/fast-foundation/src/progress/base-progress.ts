import { attr, FASTElement, nullableNumberConverter } from "@microsoft/fast-element";
/**
 * An Progress HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#progressbar | ARIA progressbar }.
 *
 * @public
 */
export class BaseProgress extends FASTElement {
    /**
     * The value of the progress
     * @public
     * @remarks
     * HTML Attribute: value
     */
    @attr({ converter: nullableNumberConverter })
    public value: number | null;

    /**
     * The minimum value
     * @public
     * @remarks
     * HTML Attribute: min
     */
    @attr({ converter: nullableNumberConverter })
    public min: number;

    /**
     * The maximum value
     * @public
     * @remarks
     * HTML Attribute: max
     */
    @attr({ converter: nullableNumberConverter })
    public max: number;

    /**
     * Indicates the progress is paused
     * @public
     * @remarks
     * HTML Attribute: paused
     */
    @attr({ mode: "boolean" })
    public paused;
}
