var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import { expect } from "chai";
import { Dialog, dialogTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
import { KeyCodes } from "@microsoft/fast-web-utilities";
const FASTDialog = Dialog.compose({
    baseName: "dialog",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { connect, disconnect, document, element } = yield fixture(FASTDialog());
        return { connect, disconnect, document, element };
    });
}
// TODO: Add tests for focus management
describe("Dialog", () => {
    it("should include a role of `dialog` on the control", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_b =
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector(".control")) === null || _b === void 0
                    ? void 0
                    : _b.getAttribute("role")
            ).to.equal("dialog");
            yield disconnect();
        }));
    it("should add an attribute of `hidden` when passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.hidden = true;
            yield connect();
            yield DOM.nextUpdate();
            expect(element.hasAttribute("hidden")).to.equal(true);
            element.hidden = false;
            yield DOM.nextUpdate();
            expect(element.hasAttribute("hidden")).to.equal(false);
            yield disconnect();
        }));
    it("should NOT add an attribute of `hidden` when passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.hasAttribute("hidden")).to.equal(false);
            yield disconnect();
        }));
    it("should add an attribute of `aria-modal` with a value equal to the modal attribute", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d, _e, _f;
            const { element, connect, disconnect } = yield setup();
            element.modal = true;
            yield connect();
            expect(
                (_d =
                    (_c = element.shadowRoot) === null || _c === void 0
                        ? void 0
                        : _c.querySelector("[role='dialog']")) === null || _d === void 0
                    ? void 0
                    : _d.getAttribute("aria-modal")
            ).to.equal("true");
            element.modal = false;
            yield DOM.nextUpdate();
            expect(
                (_f =
                    (_e = element.shadowRoot) === null || _e === void 0
                        ? void 0
                        : _e.querySelector("[role='dialog']")) === null || _f === void 0
                    ? void 0
                    : _f.getAttribute("aria-modal")
            ).to.equal("false");
            yield disconnect();
        }));
    it("should add a default `aria-modal` value of TRUE when the modal attribute is not provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _g, _h;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_h =
                    (_g = element.shadowRoot) === null || _g === void 0
                        ? void 0
                        : _g.querySelector("[role='dialog']")) === null || _h === void 0
                    ? void 0
                    : _h.getAttribute("aria-modal")
            ).to.equal("true");
            yield disconnect();
        }));
    it("should add an overlay element with a role of `presentation` when modal is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _j, _k;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_k =
                    (_j = element.shadowRoot) === null || _j === void 0
                        ? void 0
                        : _j.querySelector(".overlay")) === null || _k === void 0
                    ? void 0
                    : _k.getAttribute("role")
            ).to.equal("presentation");
            yield disconnect();
        }));
    it("should add a tabindex of -1 to the modal overlay when modal is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _l, _m;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_m =
                    (_l = element.shadowRoot) === null || _l === void 0
                        ? void 0
                        : _l.querySelector(".overlay")) === null || _m === void 0
                    ? void 0
                    : _m.getAttribute("tabindex")
            ).to.equal("-1");
            yield disconnect();
        }));
    it("should add an attribute of `trap-focus` when trapFocus is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.trapFocus = true;
            yield connect();
            yield DOM.nextUpdate();
            expect(element.hasAttribute("trap-focus")).to.equal(true);
            yield disconnect();
        }));
    it("should add a default attribute of `trap-focus` when trapFocus not defined", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            yield DOM.nextUpdate();
            expect(element.trapFocus).to.equal(true);
            expect(element.hasAttribute("trap-focus")).to.equal(true);
            yield disconnect();
        }));
    it("should NOT add an attribute of `hidden` when passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.hasAttribute("hidden")).to.equal(false);
            yield disconnect();
        }));
    it("should set the `aria-describedBy` attribute on the dialog control when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _o, _p;
            const { element, connect, disconnect } = yield setup();
            const ariaDescribedby = "testId";
            element.ariaDescribedby = ariaDescribedby;
            yield connect();
            expect(
                (_p =
                    (_o = element.shadowRoot) === null || _o === void 0
                        ? void 0
                        : _o.querySelector("[role='dialog']")) === null || _p === void 0
                    ? void 0
                    : _p.getAttribute("aria-describedBy")
            ).to.equal(ariaDescribedby);
            yield disconnect();
        }));
    it("should set the `aria-labelledby` attribute on the dialog control when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _q, _r;
            const { element, connect, disconnect } = yield setup();
            const ariaLabelledby = "testId";
            element.ariaLabelledby = ariaLabelledby;
            yield connect();
            expect(
                (_r =
                    (_q = element.shadowRoot) === null || _q === void 0
                        ? void 0
                        : _q.querySelector("[role='dialog']")) === null || _r === void 0
                    ? void 0
                    : _r.getAttribute("aria-labelledby")
            ).to.equal(ariaLabelledby);
            yield disconnect();
        }));
    it("should set the `aria-label` attribute on the dialog control when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _s, _t;
            const { element, connect, disconnect } = yield setup();
            const ariaLabel = "test label";
            element.ariaLabel = ariaLabel;
            yield connect();
            expect(
                (_t =
                    (_s = element.shadowRoot) === null || _s === void 0
                        ? void 0
                        : _s.querySelector("[role='dialog']")) === null || _t === void 0
                    ? void 0
                    : _t.getAttribute("aria-label")
            ).to.equal(ariaLabel);
            yield disconnect();
        }));
    describe("methods", () => {
        it("should set the hidden attribute to `false` when the `show()` method is invoked", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.hidden = true;
                yield connect();
                expect(element.hidden).to.equal(true);
                element.show();
                expect(element.hidden).to.equal(false);
                yield disconnect();
            }));
        it("should set the hidden attribute to `true` when the `hide()` method is invoked", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                yield connect();
                expect(element.hidden).to.equal(false);
                element.hide();
                expect(element.hidden).to.equal(true);
                yield disconnect();
            }));
    });
    describe("events", () => {
        // TODO: test trap focus
        it("should fire a 'dismiss' event when its overlay is clicked", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                yield connect();
                const overlay = element.shadowRoot.querySelector(".overlay");
                const wasDismissed = yield new Promise(resolve => {
                    element.addEventListener("dismiss", () => resolve(true));
                    overlay.click();
                    // Resolve false on the next update in case click hasn't happened
                    DOM.queueUpdate(() => resolve(false));
                });
                expect(wasDismissed).to.equal(true);
                yield disconnect();
            }));
        it("should fire a 'dismiss' event when keydown is invoked on the document", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, document } = yield setup();
                const event = new KeyboardEvent("keydown", {
                    key: "Escape",
                    keyCode: KeyCodes.escape,
                });
                yield connect();
                const wasDismissed = yield new Promise(resolve => {
                    element.addEventListener("dismiss", () => resolve(true));
                    document.dispatchEvent(event);
                    // Resolve false on the next update in case the event hasn't happened
                    DOM.queueUpdate(() => resolve(false));
                });
                expect(wasDismissed).to.equal(true);
                yield disconnect();
            }));
    });
});
