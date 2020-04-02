import { attr, FastElement } from "@microsoft/fast-element";

export enum FlipperDirection {
    next = "next",
    previous = "previous",
}

export class Flipper extends FastElement {
    @attr({ mode: "boolean" })
    public disabled: boolean;
    public disabledChanged(): void {
        this.disabled
            ? this.classList.add("disabled")
            : this.classList.remove("disabled");
    }

    @attr({ attribute: "hidden-from-at", mode: "boolean" })
    public hiddenFromAT: boolean = true;

    @attr
    public label: string;

    @attr
    public direction: FlipperDirection = FlipperDirection.next;
}
