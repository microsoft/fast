import {
    attr,
    booleanConverter,
    FASTElement,
    SyntheticViewTemplate,
} from "@microsoft/fast-element";
import { FlipperDirection } from "./flipper.options.js";

export { FlipperDirection };

/**
 * Flipper configuration options
 * @public
 */
export type FlipperOptions = {
    next?: string | SyntheticViewTemplate;
    previous?: string | SyntheticViewTemplate;
};

/**
 * A Flipper Custom HTML Element.
 * Flippers are a form of button that implies directional content navigation, such as in a carousel.
 *
 * @slot next - The next flipper content
 * @slot previous - The previous flipper content
 * @csspart next - Wraps the next flipper content
 * @csspart previous - Wraps the previous flipper content
 * @fires click - Fires a custom 'click' event when Enter or Space is invoked via keyboard and the flipper is exposed to assistive technologies.
 *
 * @public
 */
export class FASTFlipper extends FASTElement {
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
    @attr({ attribute: "aria-hidden", converter: booleanConverter })
    public hiddenFromAT: boolean = true;

    /**
     * The direction that the flipper implies navigating.
     *
     * @public
     * @remarks
     * HTML Attribute: direction
     */
    @attr
    public direction: FlipperDirection = FlipperDirection.next;

    /**
     * Simulate a click event when the flipper has focus and the user hits enter or space keys
     * Blur focus if the user hits escape key
     * @param e - Keyboard event
     * @public
     */
    public keyupHandler(e: Event & KeyboardEvent) {
        if (!this.hiddenFromAT) {
            const key = e.key;

            if (key === "Enter" || key === "Space") {
                this.$emit("click", e);
            }

            if (key === "Escape") {
                this.blur();
            }
        }
    }
}
