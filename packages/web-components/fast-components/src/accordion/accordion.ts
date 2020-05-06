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

    @observable
    public activeIndicatorRef: HTMLElement;

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
                    if (this.activeHeaderIndex !== index) {
                        header.expanded = false;
                    }
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
        if (this.isSingleExpandMode()) {
            this.resetHeaders();
            event.target.expanded = true;
        }
        this.activeid = event.target.getAttribute("id");
        this.change();
    };

    private getHeaderIds(): Array<string | null> {
        return this.accordionItems.map((accordionItem: HTMLElement) => {
            return accordionItem.getAttribute("id");
        });
    }

    private setComponent(): void {
        this.focusHeader();
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
                this.setComponent();
                break;
            case keyCodeEnd:
                this.activeHeaderIndex = this.accordionItems.length - 1;
                this.setComponent();
                break;
        }
    };

    private adjust(adjustment: number): void {
        this.activeHeaderIndex = wrapInBounds(
            0,
            this.accordionItems.length - 1,
            this.activeHeaderIndex + adjustment
        );
        this.setComponent();
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
