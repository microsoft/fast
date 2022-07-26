import {
    attr,
    FASTElement,
    nullableNumberConverter,
    SyntheticViewTemplate,
} from "@microsoft/fast-element";
import { StartEnd, StartEndOptions } from "../patterns/index.js";
import { applyMixins } from "../utilities/apply-mixins.js";

/**
 * Accordion Item configuration options
 * @public
 */
export type AccordionItemOptions = StartEndOptions & {
    expandedIcon?: string | SyntheticViewTemplate;
    collapsedIcon?: string | SyntheticViewTemplate;
};

/**
 * An individual item in an {@link @microsoft/fast-foundation#(FASTAccordion:class) }.
 *
 * @slot start - Content which can be provided between the heading and the icon
 * @slot end - Content which can be provided between the start slot and icon
 * @slot heading - Content which serves as the accordion item heading and text of the expand button
 * @slot - The default slot for accordion item content
 * @slot expanded-icon - The expanded icon
 * @slot collapsed-icon - The collapsed icon
 * @fires change - Fires a custom 'change' event when the button is invoked
 * @csspart heading - Wraps the button
 * @csspart button - The button which serves to invoke the item
 * @csspart heading-content - Wraps the slot for the heading content within the button
 * @csspart icon - The icon container
 * @csspart region - The wrapper for the accordion item content
 *
 * @public
 */
export class FASTAccordionItem extends FASTElement {
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
export interface FASTAccordionItem extends StartEnd {}
applyMixins(FASTAccordionItem, StartEnd);
