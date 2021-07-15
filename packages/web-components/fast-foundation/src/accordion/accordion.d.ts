import { FoundationElement } from "../foundation-element";
/**
 * Expand mode for {@link Accordion}
 * @public
 */
export declare enum AccordionExpandMode {
    /**
     * Designates only a single {@link @microsoft/fast-foundation#(AccordionItem:class) } can be open a time.
     */
    single = "single",
    /**
     * Designates multiple {@link @microsoft/fast-foundation#(AccordionItem:class) | AccordionItems} can be open simultaneously.
     */
    multi = "multi",
}
/**
 * An Accordion Custom HTML Element
 * Implements {@link https://www.w3.org/TR/wai-aria-practices-1.1/#accordion | ARIA Accordion}.
 * @public
 *
 * @remarks
 * Designed to be used with {@link @microsoft/fast-foundation#accordionTemplate} and {@link @microsoft/fast-foundation#(AccordionItem:class)}.
 */
export declare class Accordion extends FoundationElement {
    /**
     * Controls the expand mode of the Accordion, either allowing
     * single or multiple item expansion.
     * @public
     *
     * @remarks
     * HTML attribute: expand-mode
     */
    expandmode: AccordionExpandMode;
    /**
     * @internal
     */
    accordionItems: HTMLElement[];
    /**
     * @internal
     */
    accordionItemsChanged(oldValue: any, newValue: any): void;
    private activeid;
    private activeItemIndex;
    private accordionIds;
    private change;
    private setItems;
    private resetItems;
    private removeItemListeners;
    private activeItemChange;
    private getItemIds;
    private isSingleExpandMode;
    private handleItemKeyDown;
    private handleItemFocus;
    private adjust;
    private focusItem;
}
