var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { attr, booleanConverter } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import { FlipperDirection } from "./flipper.options";
export { FlipperDirection };
/**
 * A Flipper Custom HTML Element.
 * Flippers are a form of button that implies directional content navigation, such as in a carousel.
 *
 * @public
 */
export class Flipper extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * Indicates the flipper should be hidden from assistive technology. Because flippers are often supplementary navigation, they are often hidden from assistive technology.
         *
         * @public
         * @defaultValue - true
         * @remarks
         * HTML Attribute: aria-hidden
         */
        this.hiddenFromAT = true;
        /**
         * The direction that the flipper implies navigating.
         *
         * @public
         * @remarks
         * HTML Attribute: direction
         */
        this.direction = FlipperDirection.next;
    }
    /**
     * Simulate a click event when the flipper has focus and the user hits enter or space keys
     * Blur focus if the user hits escape key
     * @param e - Keyboard event
     * @public
     */
    keyupHandler(e) {
        if (!this.hiddenFromAT) {
            const key = e.key;
            if (key === "Enter") {
                this.$emit("click", e);
            }
            if (key === "Escape") {
                this.blur();
            }
        }
    }
}
__decorate([attr({ mode: "boolean" })], Flipper.prototype, "disabled", void 0);
__decorate(
    [attr({ attribute: "aria-hidden", converter: booleanConverter })],
    Flipper.prototype,
    "hiddenFromAT",
    void 0
);
__decorate([attr], Flipper.prototype, "direction", void 0);
