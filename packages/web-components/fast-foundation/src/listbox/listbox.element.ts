import { attr, DOM, nullableNumberConverter } from "@microsoft/fast-element";
import { Listbox } from "./listbox";

/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#listbox | ARIA listbox }.
 *
 * @public
 */
export class ListboxElement extends Listbox {
    /**
     * The maximum number of options to display.
     *
     * @remarks
     * HTML Attribute: `size`.
     *
     * @public
     */
    @attr({ converter: nullableNumberConverter })
    public size: number;

    /**
     * Prevents `focusin` events from firing before `click` events when the
     * element is unfocused.
     *
     * @override
     * @internal
     */
    public mousedownHandler(e: MouseEvent): boolean | void {
        if (e.offsetX >= 0 && e.offsetX <= this.scrollWidth) {
            return super.mousedownHandler(e);
        }
    }

    /**
     * Ensures the size is a positive integer when the property is updated.
     *
     * @param prev - the previous size value
     * @param next - the current size value
     *
     * @internal
     */
    protected sizeChanged(prev: number | unknown, next: number): void {
        const size = Math.max(0, parseInt(next.toFixed(), 10));
        if (size !== next) {
            DOM.queueUpdate(() => {
                this.size = size;
            });
        }
    }
}
