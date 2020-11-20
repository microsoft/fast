import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    keyCodeArrowDown,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeHome,
    wrapInBounds,
} from "@microsoft/fast-web-utilities";
import { AccordionItem } from "../accordion-item";

/**
 * Expand mode for {@link Accordion}
 * @public
 */
export enum AccordionExpandMode {
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
 * Designed to be used with {@link @microsoft/fast-foundation#AccordionTemplate} and {@link @microsoft/fast-foundation#(AccordionItem:class)}.
 */
export class Accordion extends FASTElement {
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
     * A reference to the active tab
     * @public
     */
    public activeItem: HTMLElement;

    /**
     * @internal
     */
    @observable
    public accordionItems: HTMLElement[];

    /**
     * @internal
     */
    public accordionItemsChanged(oldValue, newValue): void {
        if (this.$fastController.isConnected) {
            this.removeItemListeners(oldValue);
            this.accordionIds = this.getItemIds();
            this.setItems();
        }
    }

    private activeid: string;
    private activeItemIndex: number = 0;
    private accordionIds: Array<string | null>;

    private isDisabledElement = (el: Element): el is HTMLElement => {
        console.log(el);
        return el.hasAttribute("disabled");
    };

    private isFocusableElement = (el: Element): el is HTMLElement => {
        return !this.isDisabledElement(el);
    };

    private change = (): void => {
        this.$emit("change");
    };

    private setItems = (): void => {
        this.accordionIds = this.getItemIds();
        this.accordionItems.forEach((item: HTMLElement, index: number) => {
            if (item instanceof AccordionItem && this.isFocusableElement(item)) {
                item.addEventListener("change", this.activeItemChange);
                if (this.isSingleExpandMode()) {
                    this.activeItemIndex !== index
                        ? (item.expanded = false)
                        : (item.expanded = true);
                    if (this.activeItemIndex === index) {
                        item.expandbutton.setAttribute("aria-disabled", "true");
                    } else {
                        console.log("remove attribiute");
                        item.expandbutton.removeAttribute("aria-disabled");
                    }
                }
                const itemId: string | null = this.accordionIds[index];
                item.setAttribute(
                    "id",
                    typeof itemId !== "string" ? `accordion-${index + 1}` : itemId
                );
                this.activeid = this.accordionIds[this.activeItemIndex] as string;
                item.addEventListener("keydown", this.handleItemKeyDown);
                if (this.activeItemIndex === index) {
                    this.activeItem = item;
                }
            }
        });
    };

    private resetItems(): void {
        this.accordionItems.forEach((item: AccordionItem, index: number) => {
            item.expanded = false;
        });
    }

    private removeItemListeners = (oldValue: any): void => {
        oldValue.forEach((item: HTMLElement, index: number) => {
            item.removeEventListener("change", this.activeItemChange);
            item.removeEventListener("keydown", this.handleItemKeyDown);
        });
    };

    private activeItemChange = (event): void => {
        const selectedItem = event.target as HTMLElement;
        if (this.isSingleExpandMode()) {
            this.resetItems();
            event.target.expanded = true;
            event.target.expandbutton.setAttribute("aria-disabled", "true");
        }
        this.activeid = event.target.getAttribute("id");
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
        const keyCode: number = event.keyCode;
        this.accordionIds = this.getItemIds();
        switch (keyCode) {
            case keyCodeArrowUp:
                event.preventDefault();
                this.adjustBackward(event);
                break;
            case keyCodeArrowDown:
                event.preventDefault();
                this.adjustForward(event);
                break;
            case keyCodeHome:
                this.adjust(-this.activeItemIndex);
                break;
            case keyCodeEnd:
                this.adjust(this.accordionItems.length - this.activeItemIndex - 1);
                break;
        }
    };

    private adjustForward = (e: KeyboardEvent): void => {
        const group: HTMLElement[] = this.accordionItems;
        let index: number = 0;
        index = this.activeItem ? group.indexOf(this.activeItem) + 1 : 1;
        console.log("fires", index);
        if (index === group.length) {
            index = 0;
        }
        while (index < group.length && group.length > 1) {
            console.log("while", index < group.length && group.length > 1);
            if (this.isFocusableElement(group[index])) {
                this.moveToItemByIndex(group, index);
                console.log("Move tab by index");
                break;
            } else if (this.activeItem && index === group.indexOf(this.activeItem)) {
                break;
            } else if (index + 1 >= group.length) {
                index = 0;
            } else {
                index += 1;
            }
        }
    };

    private adjustBackward = (e: KeyboardEvent): void => {
        const group: HTMLElement[] = this.accordionItems;
        let index: number = 0;

        index = this.activeItem ? group.indexOf(this.activeItem) - 1 : 0;
        index = index < 0 ? group.length - 1 : index;

        while (index >= 0 && group.length > 1) {
            if (this.isFocusableElement(group[index])) {
                this.moveToItemByIndex(group, index);
                break;
            } else if (index - 1 < 0) {
                index = group.length - 1;
            } else {
                index -= 1;
            }
        }
    };

    private moveToItemByIndex = (group: HTMLElement[], index: number) => {
        const item: HTMLElement = group[index] as HTMLElement;
        this.activeItem = item;
        this.activeItemIndex = index;
        this.setItems();
        this.focusItem();
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
        const item: HTMLElement = this.accordionItems[this.activeItemIndex];
        if (item instanceof AccordionItem && this.isFocusableElement(item)) {
            item.expandbutton.focus();
        }
    }
}
