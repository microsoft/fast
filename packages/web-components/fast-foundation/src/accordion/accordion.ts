import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    keyArrowDown,
    keyArrowUp,
    keyEnd,
    keyHome,
    wrapInBounds,
} from "@microsoft/fast-web-utilities";
import { FASTAccordionItem } from "../accordion-item/accordion-item.js";
import { AccordionExpandMode } from "./accordion.options.js";

/**
 * An Accordion Custom HTML Element
 * Implements {@link https://www.w3.org/TR/wai-aria-practices-1.1/#accordion | ARIA Accordion}.
 *
 * @fires change - Fires a custom 'change' event when the active item changes
 * @csspart item - The slot for the accordion items
 * @public
 *
 * @remarks
 * Designed to be used with {@link @microsoft/fast-foundation#accordionTemplate} and {@link @microsoft/fast-foundation#(FASTAccordionItem:class)}.
 */
export class FASTAccordion extends FASTElement {
    /**
     * Controls the expand mode of the Accordion, either allowing
     * single or multiple item expansion.
     * @public
     *
     * @remarks
     * HTML attribute: expand-mode
     */
    @attr({ attribute: "expand-mode" })
    public expandmode: AccordionExpandMode = AccordionExpandMode.multi;

    /**
     * @internal
     */
    @observable
    public accordionItems: HTMLElement[];

    /**
     * @internal
     */
    public accordionItemsChanged(oldValue: HTMLElement[], newValue: HTMLElement[]): void {
        if (this.$fastController.isConnected) {
            this.removeItemListeners(oldValue);
            this.setItems();
        }
    }

    private activeid: string | null;
    private activeItemIndex: number = 0;
    private accordionIds: Array<string | null>;

    private change = (): void => {
        this.$emit("change", this.activeid);
    };

    private findExpandedItem(): FASTAccordionItem | null {
        for (let item: number = 0; item < this.accordionItems.length; item++) {
            if (this.accordionItems[item].getAttribute("expanded") === "true") {
                return this.accordionItems[item] as FASTAccordionItem;
            }
        }
        return null;
    }

    private setItems = (): void => {
        if (this.accordionItems.length === 0) {
            return;
        }
        this.accordionIds = this.getItemIds();
        this.accordionItems.forEach((item: HTMLElement, index: number) => {
            if (item instanceof FASTAccordionItem) {
                item.addEventListener("change", this.activeItemChange);
                if (this.isSingleExpandMode()) {
                    this.activeItemIndex !== index
                        ? (item.expanded = false)
                        : (item.expanded = true);
                }
            }
            const itemId: string | null = this.accordionIds[index];
            item.setAttribute(
                "id",
                typeof itemId !== "string" ? `accordion-${index + 1}` : itemId
            );
            this.activeid = this.accordionIds[this.activeItemIndex] as string;
            item.addEventListener("keydown", this.handleItemKeyDown);
            item.addEventListener("focus", this.handleItemFocus);
        });
        if (this.isSingleExpandMode()) {
            const expandedItem: FASTAccordionItem | null =
                this.findExpandedItem() ?? (this.accordionItems[0] as FASTAccordionItem);
            expandedItem.setAttribute("aria-disabled", "true");
        }
    };

    private resetItems(): void {
        this.accordionItems.forEach((item: FASTAccordionItem, index: number) => {
            item.expanded = false;
        });
    }

    private removeItemListeners = (oldValue: any): void => {
        oldValue.forEach((item: HTMLElement, index: number) => {
            item.removeEventListener("change", this.activeItemChange);
            item.removeEventListener("keydown", this.handleItemKeyDown);
            item.removeEventListener("focus", this.handleItemFocus);
        });
    };

    private activeItemChange = (event: Event): void => {
        if (event.defaultPrevented || event.target !== event.currentTarget) {
            return;
        }

        event.preventDefault();
        const selectedItem = event.target as FASTAccordionItem;
        this.activeid = selectedItem.getAttribute("id");
        if (this.isSingleExpandMode()) {
            this.resetItems();
            selectedItem.expanded = true;
            selectedItem.setAttribute("aria-disabled", "true");
            this.accordionItems.forEach((item: HTMLElement) => {
                if (!item.hasAttribute("disabled") && item.id !== this.activeid) {
                    item.removeAttribute("aria-disabled");
                }
            });
        }
        this.activeItemIndex = Array.from(this.accordionItems).indexOf(selectedItem);
        this.change();
    };

    private getItemIds(): Array<string | null> {
        return this.accordionItems.map((accordionItem: HTMLElement) => {
            return accordionItem.getAttribute("id");
        });
    }

    private isSingleExpandMode(): boolean {
        return this.expandmode === AccordionExpandMode.single;
    }

    private handleItemKeyDown = (event: KeyboardEvent): void => {
        // only handle the keydown if the event target is the accordion item
        // prevents arrow keys from moving focus to accordion headers when focus is on accordion item panel content
        if (event.target !== event.currentTarget) {
            return;
        }
        this.accordionIds = this.getItemIds();
        switch (event.key) {
            case keyArrowUp:
                event.preventDefault();
                this.adjust(-1);
                break;
            case keyArrowDown:
                event.preventDefault();
                this.adjust(1);
                break;
            case keyHome:
                this.activeItemIndex = 0;
                this.focusItem();
                break;
            case keyEnd:
                this.activeItemIndex = this.accordionItems.length - 1;
                this.focusItem();
                break;
        }
    };

    private handleItemFocus = (event: FocusEvent): void => {
        // update the active item index if the focus moves to an accordion item via a different method other than the up and down arrow key actions
        // only do so if the focus is actually on the accordion item and not on any of its children
        if (event.target === event.currentTarget) {
            const focusedItem = event.target as HTMLElement;
            const focusedIndex: number = (this.activeItemIndex = Array.from(
                this.accordionItems
            ).indexOf(focusedItem));
            if (this.activeItemIndex !== focusedIndex && focusedIndex !== -1) {
                this.activeItemIndex = focusedIndex;
                this.activeid = this.accordionIds[this.activeItemIndex] as string;
            }
        }
    };

    private adjust(adjustment: number): void {
        this.activeItemIndex = wrapInBounds(
            0,
            this.accordionItems.length - 1,
            this.activeItemIndex + adjustment
        );
        this.focusItem();
    }

    private focusItem(): void {
        const element: HTMLElement = this.accordionItems[this.activeItemIndex];
        if (element instanceof FASTAccordionItem) {
            element.expandbutton.focus();
        }
    }
}
