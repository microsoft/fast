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
import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
/**
 * A Skeleton Custom HTML Element.
 *
 * @public
 */
export class Skeleton extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * Indicates what the shape of the Skeleton should be.
         *
         * @public
         * @remarks
         * HTML Attribute: shape
         */
        this.shape = "rect";
    }
}
__decorate([attr], Skeleton.prototype, "fill", void 0);
__decorate([attr], Skeleton.prototype, "shape", void 0);
__decorate([attr], Skeleton.prototype, "pattern", void 0);
__decorate([attr({ mode: "boolean" })], Skeleton.prototype, "shimmer", void 0);
