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
/**
 * Some states and properties are applicable to all host language elements regardless of whether a role is applied.
 * The following global states and properties are supported by all roles and by all base markup elements.
 * {@link https://www.w3.org/TR/wai-aria-1.1/#global_states}
 *
 * This is intended to be used as a mixin. Be sure you extend FASTElement.
 *
 * @public
 */
export class ARIAGlobalStatesAndProperties {}
__decorate(
    [attr({ attribute: "aria-atomic", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaAtomic",
    void 0
);
__decorate(
    [attr({ attribute: "aria-busy", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaBusy",
    void 0
);
__decorate(
    [attr({ attribute: "aria-controls", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaControls",
    void 0
);
__decorate(
    [attr({ attribute: "aria-current", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaCurrent",
    void 0
);
__decorate(
    [attr({ attribute: "aria-describedby", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaDescribedby",
    void 0
);
__decorate(
    [attr({ attribute: "aria-details", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaDetails",
    void 0
);
__decorate(
    [attr({ attribute: "aria-disabled", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaDisabled",
    void 0
);
__decorate(
    [attr({ attribute: "aria-errormessage", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaErrormessage",
    void 0
);
__decorate(
    [attr({ attribute: "aria-flowto", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaFlowto",
    void 0
);
__decorate(
    [attr({ attribute: "aria-haspopup", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaHaspopup",
    void 0
);
__decorate(
    [attr({ attribute: "aria-hidden", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaHidden",
    void 0
);
__decorate(
    [attr({ attribute: "aria-invalid", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaInvalid",
    void 0
);
__decorate(
    [attr({ attribute: "aria-keyshortcuts", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaKeyshortcuts",
    void 0
);
__decorate(
    [attr({ attribute: "aria-label", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaLabel",
    void 0
);
__decorate(
    [attr({ attribute: "aria-labelledby", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaLabelledby",
    void 0
);
__decorate(
    [attr({ attribute: "aria-live", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaLive",
    void 0
);
__decorate(
    [attr({ attribute: "aria-owns", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaOwns",
    void 0
);
__decorate(
    [attr({ attribute: "aria-relevant", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaRelevant",
    void 0
);
__decorate(
    [attr({ attribute: "aria-roledescription", mode: "fromView" })],
    ARIAGlobalStatesAndProperties.prototype,
    "ariaRoledescription",
    void 0
);
