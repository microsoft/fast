import { SyntheticViewTemplate } from "@microsoft/fast-element";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";
import { FlipperDirection } from "./flipper.options";
export { FlipperDirection };
/**
 * Flipper configuration options
 * @public
 */
export declare type FlipperOptions = FoundationElementDefinition & {
    next?: string | SyntheticViewTemplate;
    previous?: string | SyntheticViewTemplate;
};
/**
 * A Flipper Custom HTML Element.
 * Flippers are a form of button that implies directional content navigation, such as in a carousel.
 *
 * @public
 */
export declare class Flipper extends FoundationElement {
    /**
     * The disabled state of the flipper.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    disabled: boolean;
    /**
     * Indicates the flipper should be hidden from assistive technology. Because flippers are often supplementary navigation, they are often hidden from assistive technology.
     *
     * @public
     * @defaultValue - true
     * @remarks
     * HTML Attribute: aria-hidden
     */
    hiddenFromAT: boolean;
    /**
     * The direction that the flipper implies navigating.
     *
     * @public
     * @remarks
     * HTML Attribute: direction
     */
    direction: FlipperDirection;
    /**
     * Simulate a click event when the flipper has focus and the user hits enter or space keys
     * Blur focus if the user hits escape key
     * @param e - Keyboard event
     * @public
     */
    keyupHandler(e: Event & KeyboardEvent): void;
}
