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
import { attr, observable } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import { ARIAGlobalStatesAndProperties, StartEnd } from "../patterns/index";
import { applyMixins } from "../utilities/apply-mixins";
/**
 * An Anchor Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element }.
 *
 * @public
 */
export class Anchor extends FoundationElement {}
__decorate([attr], Anchor.prototype, "download", void 0);
__decorate([attr], Anchor.prototype, "href", void 0);
__decorate([attr], Anchor.prototype, "hreflang", void 0);
__decorate([attr], Anchor.prototype, "ping", void 0);
__decorate([attr], Anchor.prototype, "referrerpolicy", void 0);
__decorate([attr], Anchor.prototype, "rel", void 0);
__decorate([attr], Anchor.prototype, "target", void 0);
__decorate([attr], Anchor.prototype, "type", void 0);
__decorate([observable], Anchor.prototype, "defaultSlottedContent", void 0);
/**
 * Includes ARIA states and properties relating to the ARIA link role
 *
 * @public
 */
export class DelegatesARIALink {}
__decorate(
    [attr({ attribute: "aria-expanded", mode: "fromView" })],
    DelegatesARIALink.prototype,
    "ariaExpanded",
    void 0
);
applyMixins(DelegatesARIALink, ARIAGlobalStatesAndProperties);
applyMixins(Anchor, StartEnd, DelegatesARIALink);
