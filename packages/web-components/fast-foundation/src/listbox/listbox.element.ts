import {
    attr,
    css,
    ElementStyles,
    nullableNumberConverter,
    observable,
} from "@microsoft/fast-element";
import { Listbox } from "./listbox";

/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#listbox | ARIA listbox }.
 *
 * @public
 */
export class ListboxElement extends Listbox {
    /**
     * The attribute to set the size property.
     *
     * @remarks
     * HTML Attribute: `size`.
     *
     * The value of the `size` attribute is reflected by the `size` property.
     *
     * @public
     */
    @attr({
        attribute: "size",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    public sizeAttribute: number;

    /**
     * The number of options to display.
     *
     * @remarks
     * Setting `size` property does not change the value via the `size` attribute.
     *
     * Any value above zero will force the component to display as a listbox.
     *
     * @public
     */
    @observable
    public size: number = 0;

    /**
     * The internal stylesheet which holds the `--size` custom property.
     *
     * @internal
     */
    private sizeStylesheet: ElementStyles | void;

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
     * Updates the size property when the size attribute is changed.
     *
     * @param prev - the previous size attribute value
     * @param next - the current size attribute value
     *
     * @internal
     */
    protected sizeAttributeChanged(prev: number | unknown, next: number): void {
        this.size = next;
    }

    /**
     * Updates the component dimensions when the size property is changed.
     *
     * @param prev - the previous size value
     * @param next - the current size value
     *
     * @internal
     */
    protected sizeChanged(prev: number | unknown, next: number): void {
        if (next < 0) {
            this.size = 0;
            return;
        }

        this.updateDimensions();
    }

    /**
     * Sets the max-height based on the height of the first option and the `size` attribute.
     *
     * @internal
     */
    public updateDimensions() {
        if (this.sizeStylesheet) {
            this.sizeStylesheet = this.$fastController.removeStyles(this.sizeStylesheet);
        }

        this.sizeStylesheet = css`
            :host {
                --size: ${"" + this.size};
            }
        `;

        this.$fastController.addStyles(this.sizeStylesheet);
    }
}
