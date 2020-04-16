import { attr, booleanConverter, FASTElement } from "@microsoft/fast-element";

export enum FlipperDirection {
    next = "next",
    previous = "previous",
}

export class Flipper extends FASTElement {
    @attr({ mode: "boolean" })
    public disabled: boolean;
    public disabledChanged(): void {
        this.disabled
            ? this.classList.add("disabled")
            : this.classList.remove("disabled");
    }

    @attr({ attribute: "aria-hidden", mode: "fromView", converter: booleanConverter })
    public hiddenFromAT: boolean = true;
    public hiddenFromATChanged(): void {
        this.hiddenFromAT === false
            ? this.setAttribute("tabindex", "0")
            : this.setAttribute("tabindex", "-1");
    }

    @attr
    public direction: FlipperDirection = FlipperDirection.next;
    public directionChanged(
        oldValue: FlipperDirection,
        newValue: FlipperDirection
    ): void {
        if (this.direction) {
            this.classList.remove(`${oldValue}`);
            this.classList.add(`${newValue}`);
        } else {
            this.classList.remove(`${oldValue}`);
        }
    }
}
