import {
    attr,
    FASTElement,
    html,
    nullableNumberConverter,
    observable,
} from "@microsoft/fast-element";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";

const expandedIconTemplate = html`
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.78 3h12.44c.43 0 .78.35.78.78v12.44c0 .43-.35.78-.78.78H3.78a.78.78 0 01-.78-.78V3.78c0-.43.35-.78.78-.78zm12.44-1H3.78C2.8 2 2 2.8 2 3.78v12.44C2 17.2 2.8 18 3.78 18h12.44c.98 0 1.78-.8 1.78-1.78V3.78C18 2.8 17.2 2 16.22 2zM14 9H6v2h8V9z"
        />
    </svg>
`;

const collapsedIconTemplate = html`
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.22 3H3.78a.78.78 0 00-.78.78v12.44c0 .43.35.78.78.78h12.44c.43 0 .78-.35.78-.78V3.78a.78.78 0 00-.78-.78zM3.78 2h12.44C17.2 2 18 2.8 18 3.78v12.44c0 .98-.8 1.78-1.78 1.78H3.78C2.8 18 2 17.2 2 16.22V3.78C2 2.8 2.8 2 3.78 2zM11 9h3v2h-3v3H9v-3H6V9h3V6h2v3z"
        />
    </svg>
`;

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
     * The template for expanded-icon slot
     *
     * @public
     */
    @observable
    public expandedIcon = expandedIconTemplate;

    /**
     * The template for collapsed-icon slot
     *
     * @public
     */
    @observable
    public collapsedIcon = collapsedIconTemplate;

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
