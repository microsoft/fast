import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    keyCodeArrowDown,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeHome,
    wrapInBounds,
} from "@microsoft/fast-web-utilities";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities";
import { FASTAccordionItem } from "./accordion-item";

export enum AccordionExpandMode {
    single = "single",
    multi = "multi",
}

export class Accordion extends FASTElement {
    @attr
    public expandmode: AccordionExpandMode = AccordionExpandMode.multi;

    @observable
    public accordionItems: HTMLElement[];
    public accordionItemsChanged(): void {
        if (this.$fastController.isConnected) {
            this.accordionIds = this.getHeaderIds();
            this.setItems();
        }
    }

    private activeid: string;
    private activeHeaderIndex: number = 0;
    private accordionIds: Array<string | null>;

    private change = (): void => {
        this.$emit("change", this.activeid);
    };

    private setItems = (): void => {
        this.accordionIds = this.getHeaderIds();
        this.accordionItems.forEach((header: HTMLElement, index: number) => {
            if (header instanceof FASTAccordionItem) {
                header.addEventListener("change", this.activeHeaderChange);
                if (this.isSingleExpandMode()) {
                    this.activeHeaderIndex !== index
                        ? (header.expanded = false)
                        : (header.expanded = true);
                }
            }
            const headerId: string | null = this.accordionIds[index];
            header.setAttribute(
                "id",
                typeof headerId !== "string" ? `accordion-${index + 1}` : headerId
            );
            this.activeid = this.accordionIds[this.activeHeaderIndex] as string;
            header.addEventListener("keydown", this.handleHeaderKeyDown);
        });
    };

    private resetHeaders = (): void => {
        this.accordionItems.forEach((header: FASTAccordionItem, index: number) => {
            header.expanded = false;
        });
    };

    private activeHeaderChange = (event): void => {
        const selectedHeader = event.target as HTMLElement;
        if (this.isSingleExpandMode()) {
            this.resetHeaders();
            event.target.expanded = true;
        }
        this.activeid = event.target.getAttribute("id");
        this.activeHeaderIndex = Array.from(this.accordionItems).indexOf(selectedHeader);
        this.change();
    };

    private getHeaderIds(): Array<string | null> {
        return this.accordionItems.map((accordionItem: HTMLElement) => {
            return accordionItem.getAttribute("id");
        });
    }

    private isSingleExpandMode(): boolean {
        return this.expandmode === AccordionExpandMode.single;
    }

    private handleHeaderKeyDown = (event: KeyboardEvent): void => {
        const keyCode: number = event.keyCode;
        this.accordionIds = this.getHeaderIds();
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
                this.activeHeaderIndex = 0;
                this.focusHeader();
                break;
            case keyCodeEnd:
                this.activeHeaderIndex = this.accordionItems.length - 1;
                this.focusHeader();
                break;
        }
    };

    private adjust(adjustment: number): void {
        this.activeHeaderIndex = wrapInBounds(
            0,
            this.accordionItems.length - 1,
            this.activeHeaderIndex + adjustment
        );
        this.focusHeader();
    }

    private focusHeader(): void {
        const element: HTMLElement = this.accordionItems[this.activeHeaderIndex];
        if (element instanceof FASTAccordionItem) {
            element.button.focus();
        }
    }
}

/* eslint-disable-next-line */
export interface Accordion extends StartEnd {}
applyMixins(Accordion, StartEnd);
