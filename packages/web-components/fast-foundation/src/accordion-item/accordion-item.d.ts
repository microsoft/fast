import { SyntheticViewTemplate } from "@microsoft/fast-element";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";
import { StartEnd } from "../patterns/start-end";
/**
 * Accordion Item configuration options
 * @public
 */
export declare type AccordionItemOptions = FoundationElementDefinition & {
    expandedIcon?: string | SyntheticViewTemplate;
    collapsedIcon?: string | SyntheticViewTemplate;
};
/**
 * An individual item in an {@link @microsoft/fast-foundation#(Accordion:class) }.
 * @public
 */
export declare class AccordionItem extends FoundationElement {
    /**
     * Configures the {@link https://www.w3.org/TR/wai-aria-1.1/#aria-level | level} of the
     * heading element.
     *
     * @defaultValue 2
     * @public
     * @remarks
     * HTML attribute: heading-level
     */
    headinglevel: 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * Expands or collapses the item.
     *
     * @public
     * @remarks
     * HTML attribute: expanded
     */
    expanded: boolean;
    /**
     * The item ID
     *
     * @public
     * @remarks
     * HTML Attribute: id
     */
    id: string;
    /**
     * @internal
     */
    expandbutton: HTMLElement;
    /**
     * @internal
     */
    clickHandler: (e: MouseEvent) => void;
    private change;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface AccordionItem extends StartEnd {}
