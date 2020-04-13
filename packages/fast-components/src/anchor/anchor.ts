import { attr, FastElement } from "@microsoft/fast-element";
import { ButtonAppearance } from "../button";

export type AnchorAppearance = ButtonAppearance | "hypertext";

export class Anchor extends FastElement {
    @attr
    public appearance: AnchorAppearance = "neutral";
    public appearanceChanged(
        oldValue: AnchorAppearance,
        newValue: AnchorAppearance
    ): void {
        if (oldValue !== newValue) {
            this.classList.add(newValue);
            this.classList.remove(oldValue);
        }
    }

    @attr
    public download: string;

    @attr
    public href: string;

    @attr
    public hreflang: string;

    @attr
    public ping: string;

    @attr
    public referrerpolicy: string;

    @attr
    public rel: string;

    @attr
    public target: "_self" | "_blank" | "_parent" | "_top";

    @attr
    public type: string;

    public start: HTMLSlotElement;
    public startContainer: HTMLSpanElement;
    public handleStartContentChange(): void {
        this.start.assignedNodes().length > 0
            ? this.startContainer.classList.add("start")
            : this.startContainer.classList.remove("start");
    }

    public end: HTMLSlotElement;
    public endContainer: HTMLSpanElement;
    public handleEndContentChange(): void {
        this.end.assignedNodes().length > 0
            ? this.endContainer.classList.add("end")
            : this.endContainer.classList.remove("end");
    }
}
