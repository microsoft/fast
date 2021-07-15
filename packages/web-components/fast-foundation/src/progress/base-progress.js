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
/**
 * An Progress HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#progressbar | ARIA progressbar }.
 *
 * @public
 */
export class BaseProgress extends FoundationElement {}
__decorate(
    [attr({ converter: nullableNumberConverter })],
    BaseProgress.prototype,
    "value",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    BaseProgress.prototype,
    "min",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    BaseProgress.prototype,
    "max",
    void 0
);
__decorate([attr({ mode: "boolean" })], BaseProgress.prototype, "paused", void 0);
