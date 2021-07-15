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
 * An Avatar Custom HTML Element
 *
 * @public
 */
export class Avatar extends FoundationElement {
    /**
     * Internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (!this.shape) {
            this.shape = "circle";
        }
    }
}
__decorate([attr], Avatar.prototype, "fill", void 0);
__decorate([attr], Avatar.prototype, "color", void 0);
__decorate([attr], Avatar.prototype, "link", void 0);
__decorate([attr], Avatar.prototype, "shape", void 0);
