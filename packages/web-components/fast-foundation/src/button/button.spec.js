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
import { DOM } from "@microsoft/fast-element";
import { fixture } from "../test-utilities/fixture";
import { Button, buttonTemplate as template } from "./index";
const FASTButton = Button.compose({
    baseName: "button",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { connect, disconnect, element, parent } = yield fixture(FASTButton());
        return { connect, disconnect, element, parent };
    });
}
describe("Button", () => {
    it("should set the `autofocus` attribute on the internal button when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { element, connect, disconnect } = yield setup();
            element.autofocus = true;
            yield connect();
            expect(
                (_b =
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector("button")) === null || _b === void 0
                    ? void 0
                    : _b.hasAttribute("autofocus")
            ).to.equal(true);
            yield disconnect();
        }));
    it("should set the `disabled` attribute on the internal button when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            const { element, connect, disconnect } = yield setup();
            element.disabled = true;
            yield connect();
            expect(
                (_d =
                    (_c = element.shadowRoot) === null || _c === void 0
                        ? void 0
                        : _c.querySelector("button")) === null || _d === void 0
                    ? void 0
                    : _d.hasAttribute("disabled")
            ).to.equal(true);
            yield disconnect();
        }));
    it("should set the `form` attribute on the internal button when `formId` is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            const { element, connect, disconnect } = yield setup();
            const formId = "testId";
            element.formId = "testId";
            yield connect();
            expect(
                (_f =
                    (_e = element.shadowRoot) === null || _e === void 0
                        ? void 0
                        : _e.querySelector("button")) === null || _f === void 0
                    ? void 0
                    : _f.getAttribute("form")
            ).to.equal(formId);
            yield disconnect();
        }));
    it("should set the `formaction` attribute on the internal button when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _g, _h;
            const { element, connect, disconnect } = yield setup();
            const formaction = "test_action.asp";
            element.formaction = formaction;
            yield connect();
            expect(
                (_h =
                    (_g = element.shadowRoot) === null || _g === void 0
                        ? void 0
                        : _g.querySelector("button")) === null || _h === void 0
                    ? void 0
                    : _h.getAttribute("formaction")
            ).to.equal(formaction);
            yield disconnect();
        }));
    it("should set the `formenctype` attribute on the internal button when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _j, _k;
            const { element, connect, disconnect } = yield setup();
            const formenctype = "text/plain";
            element.formenctype = formenctype;
            yield connect();
            expect(
                (_k =
                    (_j = element.shadowRoot) === null || _j === void 0
                        ? void 0
                        : _j.querySelector("button")) === null || _k === void 0
                    ? void 0
                    : _k.getAttribute("formenctype")
            ).to.equal(formenctype);
            yield disconnect();
        }));
    it("should set the `formmethod` attribute on the internal button when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _l, _m;
            const { element, connect, disconnect } = yield setup();
            const formmethod = "post";
            element.formmethod = formmethod;
            yield connect();
            expect(
                (_m =
                    (_l = element.shadowRoot) === null || _l === void 0
                        ? void 0
                        : _l.querySelector("button")) === null || _m === void 0
                    ? void 0
                    : _m.getAttribute("formmethod")
            ).to.equal(formmethod);
            yield disconnect();
        }));
    it("should set the `formnovalidate` attribute on the internal button when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _o, _p;
            const { element, connect, disconnect } = yield setup();
            const formnovalidate = true;
            element.formnovalidate = formnovalidate;
            yield connect();
            expect(
                (_p =
                    (_o = element.shadowRoot) === null || _o === void 0
                        ? void 0
                        : _o.querySelector("button")) === null || _p === void 0
                    ? void 0
                    : _p.getAttribute("formnovalidate")
            ).to.equal(formnovalidate.toString());
            yield disconnect();
        }));
    it("should set the `formtarget` attribute on the internal button when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _q, _r;
            const { element, connect, disconnect } = yield setup();
            const formtarget = "_blank";
            element.formtarget = formtarget;
            yield connect();
            expect(
                (_r =
                    (_q = element.shadowRoot) === null || _q === void 0
                        ? void 0
                        : _q.querySelector("button")) === null || _r === void 0
                    ? void 0
                    : _r.getAttribute("formtarget")
            ).to.equal(formtarget);
            yield disconnect();
        }));
    it("should set the `name` attribute on the internal button when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _s, _t;
            const { element, connect, disconnect } = yield setup();
            const name = "testName";
            element.name = name;
            yield connect();
            expect(
                (_t =
                    (_s = element.shadowRoot) === null || _s === void 0
                        ? void 0
                        : _s.querySelector("button")) === null || _t === void 0
                    ? void 0
                    : _t.getAttribute("name")
            ).to.equal(name);
            yield disconnect();
        }));
    it("should set the `type` attribute on the internal button when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _u, _v;
            const { element, connect, disconnect } = yield setup();
            const type = "submit";
            element.type = type;
            yield connect();
            expect(
                (_v =
                    (_u = element.shadowRoot) === null || _u === void 0
                        ? void 0
                        : _u.querySelector("button")) === null || _v === void 0
                    ? void 0
                    : _v.getAttribute("type")
            ).to.equal(type);
            yield disconnect();
        }));
    it("should set the `value` attribute on the internal button when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _w, _x;
            const { element, connect, disconnect } = yield setup();
            const value = "Reset";
            element.value = value;
            yield connect();
            expect(
                (_x =
                    (_w = element.shadowRoot) === null || _w === void 0
                        ? void 0
                        : _w.querySelector("button")) === null || _x === void 0
                    ? void 0
                    : _x.getAttribute("value")
            ).to.equal(value);
            yield disconnect();
        }));
    describe("Delegates ARIA button", () => {
        it("should set the `aria-atomic` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                const { element, connect, disconnect } = yield setup();
                const ariaAtomic = "true";
                element.ariaAtomic = ariaAtomic;
                yield connect();
                expect(
                    (_b =
                        (_a = element.shadowRoot) === null || _a === void 0
                            ? void 0
                            : _a.querySelector("button")) === null || _b === void 0
                        ? void 0
                        : _b.getAttribute("aria-atomic")
                ).to.equal(ariaAtomic);
                yield disconnect();
            }));
        it("should set the `aria-busy` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _c, _d;
                const { element, connect, disconnect } = yield setup();
                const ariaBusy = "false";
                element.ariaBusy = ariaBusy;
                yield connect();
                expect(
                    (_d =
                        (_c = element.shadowRoot) === null || _c === void 0
                            ? void 0
                            : _c.querySelector("button")) === null || _d === void 0
                        ? void 0
                        : _d.getAttribute("aria-busy")
                ).to.equal(ariaBusy);
                yield disconnect();
            }));
        it("should set the `aria-controls` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _e, _f;
                const { element, connect, disconnect } = yield setup();
                const ariaControls = "testId";
                element.ariaControls = ariaControls;
                yield connect();
                expect(
                    (_f =
                        (_e = element.shadowRoot) === null || _e === void 0
                            ? void 0
                            : _e.querySelector("button")) === null || _f === void 0
                        ? void 0
                        : _f.getAttribute("aria-controls")
                ).to.equal(ariaControls);
                yield disconnect();
            }));
        it("should set the `aria-current` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _g, _h;
                const { element, connect, disconnect } = yield setup();
                const ariaCurrent = "page";
                element.ariaCurrent = ariaCurrent;
                yield connect();
                expect(
                    (_h =
                        (_g = element.shadowRoot) === null || _g === void 0
                            ? void 0
                            : _g.querySelector("button")) === null || _h === void 0
                        ? void 0
                        : _h.getAttribute("aria-current")
                ).to.equal(ariaCurrent);
                yield disconnect();
            }));
        it("should set the `aria-describedBy` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _j, _k;
                const { element, connect, disconnect } = yield setup();
                const ariaDescribedby = "testId";
                element.ariaDescribedby = ariaDescribedby;
                yield connect();
                expect(
                    (_k =
                        (_j = element.shadowRoot) === null || _j === void 0
                            ? void 0
                            : _j.querySelector("button")) === null || _k === void 0
                        ? void 0
                        : _k.getAttribute("aria-describedBy")
                ).to.equal(ariaDescribedby);
                yield disconnect();
            }));
        it("should set the `aria-details` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _l, _m;
                const { element, connect, disconnect } = yield setup();
                const ariaDetails = "testId";
                element.ariaDetails = ariaDetails;
                yield connect();
                expect(
                    (_m =
                        (_l = element.shadowRoot) === null || _l === void 0
                            ? void 0
                            : _l.querySelector("button")) === null || _m === void 0
                        ? void 0
                        : _m.getAttribute("aria-details")
                ).to.equal(ariaDetails);
                yield disconnect();
            }));
        it("should set the `aria-disabled` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _o, _p;
                const { element, connect, disconnect } = yield setup();
                const ariaDisabled = "true";
                element.ariaDisabled = ariaDisabled;
                yield connect();
                expect(
                    (_p =
                        (_o = element.shadowRoot) === null || _o === void 0
                            ? void 0
                            : _o.querySelector("button")) === null || _p === void 0
                        ? void 0
                        : _p.getAttribute("aria-disabled")
                ).to.equal(ariaDisabled);
                yield disconnect();
            }));
        it("should set the `aria-errormessage` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _q, _r;
                const { element, connect, disconnect } = yield setup();
                const ariaErrormessage = "test";
                element.ariaErrormessage = ariaErrormessage;
                yield connect();
                expect(
                    (_r =
                        (_q = element.shadowRoot) === null || _q === void 0
                            ? void 0
                            : _q.querySelector("button")) === null || _r === void 0
                        ? void 0
                        : _r.getAttribute("aria-errormessage")
                ).to.equal(ariaErrormessage);
                yield disconnect();
            }));
        it("should set the `aria-expanded` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _s, _t;
                const { element, connect, disconnect } = yield setup();
                const ariaExpanded = "true";
                element.ariaExpanded = ariaExpanded;
                yield connect();
                expect(
                    (_t =
                        (_s = element.shadowRoot) === null || _s === void 0
                            ? void 0
                            : _s.querySelector("button")) === null || _t === void 0
                        ? void 0
                        : _t.getAttribute("aria-expanded")
                ).to.equal(ariaExpanded);
                yield disconnect();
            }));
        it("should set the `aria-flowto` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _u, _v;
                const { element, connect, disconnect } = yield setup();
                const ariaFlowto = "testId";
                element.ariaFlowto = ariaFlowto;
                yield connect();
                expect(
                    (_v =
                        (_u = element.shadowRoot) === null || _u === void 0
                            ? void 0
                            : _u.querySelector("button")) === null || _v === void 0
                        ? void 0
                        : _v.getAttribute("aria-flowto")
                ).to.equal(ariaFlowto);
                yield disconnect();
            }));
        it("should set the `aria-haspopup` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _w, _x;
                const { element, connect, disconnect } = yield setup();
                const ariaHaspopup = "true";
                element.ariaHaspopup = ariaHaspopup;
                yield connect();
                expect(
                    (_x =
                        (_w = element.shadowRoot) === null || _w === void 0
                            ? void 0
                            : _w.querySelector("button")) === null || _x === void 0
                        ? void 0
                        : _x.getAttribute("aria-haspopup")
                ).to.equal(ariaHaspopup);
                yield disconnect();
            }));
        it("should set the `aria-hidden` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _y, _z;
                const { element, connect, disconnect } = yield setup();
                const ariaHidden = "true";
                element.ariaHidden = ariaHidden;
                yield connect();
                expect(
                    (_z =
                        (_y = element.shadowRoot) === null || _y === void 0
                            ? void 0
                            : _y.querySelector("button")) === null || _z === void 0
                        ? void 0
                        : _z.getAttribute("aria-hidden")
                ).to.equal(ariaHidden);
                yield disconnect();
            }));
        it("should set the `aria-invalid` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _0, _1;
                const { element, connect, disconnect } = yield setup();
                const ariaInvalid = "spelling";
                element.ariaInvalid = ariaInvalid;
                yield connect();
                expect(
                    (_1 =
                        (_0 = element.shadowRoot) === null || _0 === void 0
                            ? void 0
                            : _0.querySelector("button")) === null || _1 === void 0
                        ? void 0
                        : _1.getAttribute("aria-invalid")
                ).to.equal(ariaInvalid);
                yield disconnect();
            }));
        it("should set the `aria-keyshortcuts` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _2, _3;
                const { element, connect, disconnect } = yield setup();
                const ariaKeyshortcuts = "F4";
                element.ariaKeyshortcuts = ariaKeyshortcuts;
                yield connect();
                expect(
                    (_3 =
                        (_2 = element.shadowRoot) === null || _2 === void 0
                            ? void 0
                            : _2.querySelector("button")) === null || _3 === void 0
                        ? void 0
                        : _3.getAttribute("aria-keyshortcuts")
                ).to.equal(ariaKeyshortcuts);
                yield disconnect();
            }));
        it("should set the `aria-label` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _4, _5;
                const { element, connect, disconnect } = yield setup();
                const ariaLabel = "Foo label";
                element.ariaLabel = ariaLabel;
                yield connect();
                expect(
                    (_5 =
                        (_4 = element.shadowRoot) === null || _4 === void 0
                            ? void 0
                            : _4.querySelector("button")) === null || _5 === void 0
                        ? void 0
                        : _5.getAttribute("aria-label")
                ).to.equal(ariaLabel);
                yield disconnect();
            }));
        it("should set the `aria-labelledby` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _6, _7;
                const { element, connect, disconnect } = yield setup();
                const ariaLabelledby = "testId";
                element.ariaLabelledby = ariaLabelledby;
                yield connect();
                expect(
                    (_7 =
                        (_6 = element.shadowRoot) === null || _6 === void 0
                            ? void 0
                            : _6.querySelector("button")) === null || _7 === void 0
                        ? void 0
                        : _7.getAttribute("aria-labelledby")
                ).to.equal(ariaLabelledby);
                yield disconnect();
            }));
        it("should set the `aria-live` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _8, _9;
                const { element, connect, disconnect } = yield setup();
                const ariaLive = "polite";
                element.ariaLive = ariaLive;
                yield connect();
                expect(
                    (_9 =
                        (_8 = element.shadowRoot) === null || _8 === void 0
                            ? void 0
                            : _8.querySelector("button")) === null || _9 === void 0
                        ? void 0
                        : _9.getAttribute("aria-live")
                ).to.equal(ariaLive);
                yield disconnect();
            }));
        it("should set the `aria-owns` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _10, _11;
                const { element, connect, disconnect } = yield setup();
                const ariaOwns = "testId";
                element.ariaOwns = ariaOwns;
                yield connect();
                expect(
                    (_11 =
                        (_10 = element.shadowRoot) === null || _10 === void 0
                            ? void 0
                            : _10.querySelector("button")) === null || _11 === void 0
                        ? void 0
                        : _11.getAttribute("aria-owns")
                ).to.equal(ariaOwns);
                yield disconnect();
            }));
        it("should set the `aria-pressed` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _12, _13;
                const { element, connect, disconnect } = yield setup();
                const ariaPressed = "true";
                element.ariaPressed = ariaPressed;
                yield connect();
                expect(
                    (_13 =
                        (_12 = element.shadowRoot) === null || _12 === void 0
                            ? void 0
                            : _12.querySelector("button")) === null || _13 === void 0
                        ? void 0
                        : _13.getAttribute("aria-pressed")
                ).to.equal(ariaPressed);
                yield disconnect();
            }));
        it("should set the `aria-relevant` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _14, _15;
                const { element, connect, disconnect } = yield setup();
                const ariaRelevant = "removals";
                element.ariaRelevant = ariaRelevant;
                yield connect();
                expect(
                    (_15 =
                        (_14 = element.shadowRoot) === null || _14 === void 0
                            ? void 0
                            : _14.querySelector("button")) === null || _15 === void 0
                        ? void 0
                        : _15.getAttribute("aria-relevant")
                ).to.equal(ariaRelevant);
                yield disconnect();
            }));
        it("should set the `aria-roledescription` attribute on the internal button when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _16, _17;
                const { element, connect, disconnect } = yield setup();
                const ariaRoledescription = "slide";
                element.ariaRoledescription = ariaRoledescription;
                yield connect();
                expect(
                    (_17 =
                        (_16 = element.shadowRoot) === null || _16 === void 0
                            ? void 0
                            : _16.querySelector("button")) === null || _17 === void 0
                        ? void 0
                        : _17.getAttribute("aria-roledescription")
                ).to.equal(ariaRoledescription);
                yield disconnect();
            }));
    });
    describe("of type 'submit'", () => {
        it("should submit the parent form when clicked", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element, parent } = yield setup();
                const form = document.createElement("form");
                element.setAttribute("type", "submit");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                const wasSumbitted = yield new Promise(resolve => {
                    // Resolve as true when the event listener is handled
                    form.addEventListener("submit", event => {
                        event.preventDefault();
                        expect(event.submitter).to.equal(element.proxy);
                        resolve(true);
                    });
                    element.click();
                    // Resolve false on the next update in case reset hasn't happened
                    DOM.queueUpdate(() => resolve(false));
                });
                expect(wasSumbitted).to.equal(true);
                yield disconnect();
            }));
    });
    describe("of type 'reset'", () => {
        it("should reset the parent form when clicked", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element, parent } = yield setup();
                const form = document.createElement("form");
                element.setAttribute("type", "reset");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                const wasReset = yield new Promise(resolve => {
                    // Resolve true when the event listener is handled
                    form.addEventListener("reset", () => resolve(true));
                    element.click();
                    // Resolve false on the next update in case reset hasn't happened
                    DOM.queueUpdate(() => resolve(false));
                });
                expect(wasReset).to.equal(true);
                yield disconnect();
            }));
    });
});
