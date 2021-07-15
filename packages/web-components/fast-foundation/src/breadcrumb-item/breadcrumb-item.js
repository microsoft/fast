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
import { observable } from "@microsoft/fast-element";
import { Anchor, DelegatesARIALink } from "../anchor";
import { StartEnd } from "../patterns/index";
import { applyMixins } from "../utilities/apply-mixins";
/**
 * A Breadcrumb Item Custom HTML Element.
 *
 * @public
 */
export class BreadcrumbItem extends Anchor {
    constructor() {
        super(...arguments);
        /**
         * @internal
         */
        this.separator = true;
    }
}
__decorate([observable], BreadcrumbItem.prototype, "separator", void 0);
applyMixins(BreadcrumbItem, StartEnd, DelegatesARIALink);
