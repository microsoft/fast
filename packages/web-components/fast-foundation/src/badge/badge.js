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
 * A Badge Custom HTML Element.
 *
 * @public
 */
export class Badge extends FoundationElement {
    constructor() {
        super(...arguments);
        this.generateBadgeStyle = () => {
            if (!this.fill && !this.color) {
                return;
            }
            const fill = `background-color: var(--badge-fill-${this.fill});`;
            const color = `color: var(--badge-color-${this.color});`;
            if (this.fill && !this.color) {
                return fill;
            } else if (this.color && !this.fill) {
                return color;
            } else {
                return `${color} ${fill}`;
            }
        };
    }
}
__decorate([attr({ attribute: "fill" })], Badge.prototype, "fill", void 0);
__decorate([attr({ attribute: "color" })], Badge.prototype, "color", void 0);
__decorate([attr({ mode: "boolean" })], Badge.prototype, "circular", void 0);
