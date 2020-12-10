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

    private change = (): void => {
        this.$emit("change");
    };

    private setItems = (): void => {
        this.accordionIds = this.getItemIds();
        this.accordionItems.forEach((item: HTMLElement, index: number) => {
            if (item instanceof AccordionItem) {
                item.addEventListener("change", this.activeItemChange);

                if (this.isSingleExpandMode()) {
                    if (this.activeItemIndex === index) {
                        item.expanded = true;
                        item.setAttribute("aria-disabled", "true");
                    } else {
                        item.expanded = false;
                        item.removeAttribute("aria-disabled");
                    }
                }

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
        });
    };

    private resetItems(): void {
        this.accordionItems.forEach((item: AccordionItem, index: number) => {
            if (item.expanded === true) {
                item.removeAttribute("aria-disabled");
            }
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
            event.target.setAttribute("aria-disabled", "true");
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
                this.adjust(-1);
                break;
            case keyCodeArrowDown:
                event.preventDefault();
                this.adjust(1);
                break;
            case keyCodeHome:
                this.activeItemIndex = 0;
                this.focusItem();
                break;
            case keyCodeEnd:
                this.activeItemIndex = this.accordionItems.length - 1;
                this.focusItem();
                break;
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
        if (element instanceof AccordionItem) {
            element.expandbutton.focus();
        }
    }
}
