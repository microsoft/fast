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
import { attr, nullableNumberConverter } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
/**
 * An individual item in an {@link @microsoft/fast-foundation#(Accordion:class) }.
 * @public
 */
export class AccordionItem extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * Configures the {@link https://www.w3.org/TR/wai-aria-1.1/#aria-level | level} of the
         * heading element.
         *
         * @defaultValue 2
         * @public
         * @remarks
         * HTML attribute: heading-level
         */
        this.headinglevel = 2;
        /**
         * Expands or collapses the item.
         *
         * @public
         * @remarks
         * HTML attribute: expanded
         */
        this.expanded = false;
        /**
         * @internal
         */
        this.clickHandler = e => {
            this.expanded = !this.expanded;
            this.change();
        };
        this.change = () => {
            this.$emit("change");
        };
    }
}
__decorate(
    [
        attr({
            attribute: "heading-level",
            mode: "fromView",
            converter: nullableNumberConverter,
        }),
    ],
    AccordionItem.prototype,
    "headinglevel",
    void 0
);
__decorate([attr({ mode: "boolean" })], AccordionItem.prototype, "expanded", void 0);
__decorate([attr], AccordionItem.prototype, "id", void 0);
applyMixins(AccordionItem, StartEnd);
