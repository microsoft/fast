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
import { DividerRole } from "./divider.options";
export { DividerRole };
/**
 * A Divider Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#separator | ARIA separator } or {@link https://www.w3.org/TR/wai-aria-1.1/#presentation | ARIA presentation}.
 *
 * @public
 */
export class Divider extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * The role of the element.
         *
         * @public
         * @defaultValue - {@link DividerRole.separator}
         * @remarks
         * HTML Attribute: role
         */
        this.role = DividerRole.separator;
    }
}
__decorate([attr], Divider.prototype, "role", void 0);
