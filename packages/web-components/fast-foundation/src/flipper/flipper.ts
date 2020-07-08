import { attr, booleanConverter, FASTElement } from "@microsoft/fast-element";

/**
 * The direction options for flipper.
 * @public
 */
export enum FlipperDirection {
    next = "next",
    previous = "previous",
}

/**
 * A Flipper Custom HTML Element.
 * Flippers are a form of button that implies directional content navigation, such as in a carousel.
 *
 * @public
 */
export class Flipper extends FASTElement {
    /**
     * The disabled state of the flipper.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;

    /**
     * Indicates the flipper should be hidden from assistive technology. Because flippers are often supplementary navigation, they are often hidden from assistive technology.
     *
     * @public
     * @defaultValue - true
     * @remarks
     * HTML Attribute: aria-hidden
     */
    @attr({ attribute: "aria-hidden", mode: "fromView", converter: booleanConverter })
    public hiddenFromAT: boolean = true;
    private hiddenFromATChanged(): void {
        if (!this.hiddenFromAT) {
            this.setAttribute("role", "button");
        }
    }

    /**
     * The direction that the flipper implies navigating.
     *
     * @public
     * @remarks
     * HTML Attribute: direction
     */
    @attr
    public direction: FlipperDirection = FlipperDirection.next;
}
