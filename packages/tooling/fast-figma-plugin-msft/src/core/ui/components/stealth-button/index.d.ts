import { FASTElement } from "@microsoft/fast-element";
export declare class StealthButton extends FASTElement {
    glyph: HTMLSlotElement;
    content: HTMLSlotElement;
    connectedCallback(): void;
    private hasGlyph;
    private hasContent;
    private slotHasContent;
}
