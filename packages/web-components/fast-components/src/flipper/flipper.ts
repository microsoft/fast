import { attr, booleanConverter, FASTElement } from "@microsoft/fast-element";

export enum FlipperDirection {
    next = "next",
    previous = "previous",
}

export class Flipper extends FASTElement {
    @attr({ mode: "boolean" })
    public disabled: boolean;

    @attr({ attribute: "aria-hidden", mode: "fromView", converter: booleanConverter })
    public hiddenFromAT: boolean = true;

    @attr
    public direction: FlipperDirection = FlipperDirection.next;
}
