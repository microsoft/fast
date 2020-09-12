import { attr, FASTElement, nullableNumberConverter } from "@microsoft/fast-element";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";

/**
 * An individual item in an {@link @microsoft/fast-foundation#(Accordion:class) }.
 * @public
 */
export class AccordionItem extends FASTElement {
    /**
     * Configures the {@link https://www.w3.org/TR/wai-aria-1.1/#aria-level | level} of the
     * heading element.
     *
     * @defaultValue 2
     * @public
     * @remarks
     * HTML attribute: heading-level
     */
    @attr({
        attribute: "heading-level",
        mode: "fromView",
        converter: nullableNumberConverter,
    })
    public headinglevel: 1 | 2 | 3 | 4 | 5 | 6 = 2;

    /**
     * Expands or collapses the item.
     *
     * @public
     * @remarks
     * HTML attribute: expanded
     */
    @attr({ mode: "boolean" })
    public expanded: boolean = false;

    /**
     * The item ID
     *
     * @public
     * @remarks
     * HTML Attribute: id
     */
    @attr
    public id: string;

    /**
     * @internal
     */
    public expandbutton: HTMLElement;

    /**
     * @internal
     */
    public clickHandler = (e: MouseEvent) => {
        this.expanded = !this.expanded;
        this.change();
    };

    private change = (): void => {
        this.$emit("change");
    };
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface AccordionItem extends StartEnd {}
applyMixins(AccordionItem, StartEnd);
