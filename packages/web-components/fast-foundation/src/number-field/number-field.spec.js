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
import { DOM } from "@microsoft/fast-element";
import { expect, assert } from "chai";
import { fixture } from "../test-utilities/fixture";
import { NumberField, numberFieldTemplate as template } from "./index";
const FASTNumberField = NumberField.compose({
    baseName: "number-field",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect, parent } = yield fixture(FASTNumberField());
        return { element, connect, disconnect, parent };
    });
}
describe("NumberField", () => {
    it("should set the `autofocus` attribute on the internal control equal to the value provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { element, connect, disconnect } = yield setup();
            const autofocus = true;
            element.autofocus = autofocus;
            yield connect();
            expect(
                (_b =
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector(".control")) === null || _b === void 0
                    ? void 0
                    : _b.hasAttribute("autofocus")
            ).to.equal(true);
            yield disconnect();
        }));
    it("should set the `disabled` attribute on the internal control equal to the value provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            const { element, connect, disconnect } = yield setup();
            const disabled = true;
            element.disabled = disabled;
            yield connect();
            expect(
                (_d =
                    (_c = element.shadowRoot) === null || _c === void 0
                        ? void 0
                        : _c.querySelector(".control")) === null || _d === void 0
                    ? void 0
                    : _d.hasAttribute("disabled")
            ).to.equal(true);
            yield disconnect();
        }));
    it("should set the `list` attribute on the internal control equal to the value provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            const { element, connect, disconnect } = yield setup();
            const list = "listId";
            element.list = list;
            yield connect();
            expect(
                (_f =
                    (_e = element.shadowRoot) === null || _e === void 0
                        ? void 0
                        : _e.querySelector(".control")) === null || _f === void 0
                    ? void 0
                    : _f.getAttribute("list")
            ).to.equal(list);
            yield disconnect();
        }));
    it("should set the `maxlength` attribute on the internal control equal to the value provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _g, _h;
            const { element, connect, disconnect } = yield setup();
            const maxlength = 14;
            element.maxlength = maxlength;
            yield connect();
            expect(
                (_h =
                    (_g = element.shadowRoot) === null || _g === void 0
                        ? void 0
                        : _g.querySelector(".control")) === null || _h === void 0
                    ? void 0
                    : _h.getAttribute("maxlength")
            ).to.equal(maxlength.toString());
            yield disconnect();
        }));
    it("should set the `minlength` attribute on the internal control equal to the value provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _j, _k;
            const { element, connect, disconnect } = yield setup();
            const minlength = 8;
            element.minlength = minlength;
            yield connect();
            expect(
                (_k =
                    (_j = element.shadowRoot) === null || _j === void 0
                        ? void 0
                        : _j.querySelector(".control")) === null || _k === void 0
                    ? void 0
                    : _k.getAttribute("minlength")
            ).to.equal(minlength.toString());
            yield disconnect();
        }));
    it("should set the `placeholder` attribute on the internal control equal to the value provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _l, _m;
            const { element, connect, disconnect } = yield setup();
            const placeholder = "placeholder";
            element.placeholder = placeholder;
            yield connect();
            expect(
                (_m =
                    (_l = element.shadowRoot) === null || _l === void 0
                        ? void 0
                        : _l.querySelector(".control")) === null || _m === void 0
                    ? void 0
                    : _m.getAttribute("placeholder")
            ).to.equal(placeholder);
            yield disconnect();
        }));
    it("should set the `readonly` attribute on the internal control equal to the value provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _o, _p;
            const { element, connect, disconnect } = yield setup();
            const readonly = true;
            element.readOnly = readonly;
            yield connect();
            expect(
                (_p =
                    (_o = element.shadowRoot) === null || _o === void 0
                        ? void 0
                        : _o.querySelector(".control")) === null || _p === void 0
                    ? void 0
                    : _p.hasAttribute("readonly")
            ).to.equal(true);
            yield disconnect();
        }));
    it("should set the `required` attribute on the internal control equal to the value provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _q, _r;
            const { element, connect, disconnect } = yield setup();
            const required = true;
            element.required = required;
            yield connect();
            expect(
                (_r =
                    (_q = element.shadowRoot) === null || _q === void 0
                        ? void 0
                        : _q.querySelector(".control")) === null || _r === void 0
                    ? void 0
                    : _r.hasAttribute("required")
            ).to.equal(true);
            yield disconnect();
        }));
    it("should set the `size` attribute on the internal control equal to the value provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _s, _t;
            const { element, connect, disconnect } = yield setup();
            const size = 8;
            element.size = size;
            yield connect();
            expect(
                (_t =
                    (_s = element.shadowRoot) === null || _s === void 0
                        ? void 0
                        : _s.querySelector(".control")) === null || _t === void 0
                    ? void 0
                    : _t.hasAttribute("size")
            ).to.equal(true);
            yield disconnect();
        }));
    it("should initialize to the initial value if no value property is set", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.value).to.equal(element["initialValue"]);
            yield disconnect();
        }));
    it("should initialize to the provided value attribute if set pre-connection", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.setAttribute("value", "10");
            yield connect();
            expect(element.value).to.equal("10");
            yield disconnect();
        }));
    it("should initialize to the provided value attribute if set post-connection", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            element.setAttribute("value", "10");
            expect(element.value).to.equal("10");
            yield disconnect();
        }));
    it("should initialize to the provided value property if set pre-connection", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.value = "10";
            yield connect();
            expect(element.value).to.equal("10");
            yield disconnect();
        }));
    describe("Delegates ARIA textbox", () => {
        it("should set the `aria-atomic` attribute on the internal control when provided", () =>
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
                            : _a.querySelector(".control")) === null || _b === void 0
                        ? void 0
                        : _b.getAttribute("aria-atomic")
                ).to.equal(ariaAtomic);
                yield disconnect();
            }));
        it("should set the `aria-busy` attribute on the internal control when provided", () =>
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
                            : _c.querySelector(".control")) === null || _d === void 0
                        ? void 0
                        : _d.getAttribute("aria-busy")
                ).to.equal(ariaBusy);
                yield disconnect();
            }));
        it("should set the `aria-controls` attribute on the internal control when provided", () =>
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
                            : _e.querySelector(".control")) === null || _f === void 0
                        ? void 0
                        : _f.getAttribute("aria-controls")
                ).to.equal(ariaControls);
                yield disconnect();
            }));
        it("should set the `aria-current` attribute on the internal control when provided", () =>
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
                            : _g.querySelector(".control")) === null || _h === void 0
                        ? void 0
                        : _h.getAttribute("aria-current")
                ).to.equal(ariaCurrent);
                yield disconnect();
            }));
        it("should set the `aria-describedBy` attribute on the internal control when provided", () =>
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
                            : _j.querySelector(".control")) === null || _k === void 0
                        ? void 0
                        : _k.getAttribute("aria-describedBy")
                ).to.equal(ariaDescribedby);
                yield disconnect();
            }));
        it("should set the `aria-details` attribute on the internal control when provided", () =>
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
                            : _l.querySelector(".control")) === null || _m === void 0
                        ? void 0
                        : _m.getAttribute("aria-details")
                ).to.equal(ariaDetails);
                yield disconnect();
            }));
        it("should set the `aria-disabled` attribute on the internal control when provided", () =>
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
                            : _o.querySelector(".control")) === null || _p === void 0
                        ? void 0
                        : _p.getAttribute("aria-disabled")
                ).to.equal(ariaDisabled);
                yield disconnect();
            }));
        it("should set the `aria-errormessage` attribute on the internal control when provided", () =>
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
                            : _q.querySelector(".control")) === null || _r === void 0
                        ? void 0
                        : _r.getAttribute("aria-errormessage")
                ).to.equal(ariaErrormessage);
                yield disconnect();
            }));
        it("should set the `aria-flowto` attribute on the internal control when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _s, _t;
                const { element, connect, disconnect } = yield setup();
                const ariaFlowto = "testId";
                element.ariaFlowto = ariaFlowto;
                yield connect();
                expect(
                    (_t =
                        (_s = element.shadowRoot) === null || _s === void 0
                            ? void 0
                            : _s.querySelector(".control")) === null || _t === void 0
                        ? void 0
                        : _t.getAttribute("aria-flowto")
                ).to.equal(ariaFlowto);
                yield disconnect();
            }));
        it("should set the `aria-haspopup` attribute on the internal control when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _u, _v;
                const { element, connect, disconnect } = yield setup();
                const ariaHaspopup = "true";
                element.ariaHaspopup = ariaHaspopup;
                yield connect();
                expect(
                    (_v =
                        (_u = element.shadowRoot) === null || _u === void 0
                            ? void 0
                            : _u.querySelector(".control")) === null || _v === void 0
                        ? void 0
                        : _v.getAttribute("aria-haspopup")
                ).to.equal(ariaHaspopup);
                yield disconnect();
            }));
        it("should set the `aria-hidden` attribute on the internal control when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _w, _x;
                const { element, connect, disconnect } = yield setup();
                const ariaHidden = "true";
                element.ariaHidden = ariaHidden;
                yield connect();
                expect(
                    (_x =
                        (_w = element.shadowRoot) === null || _w === void 0
                            ? void 0
                            : _w.querySelector(".control")) === null || _x === void 0
                        ? void 0
                        : _x.getAttribute("aria-hidden")
                ).to.equal(ariaHidden);
                yield disconnect();
            }));
        it("should set the `aria-invalid` attribute on the internal control when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _y, _z;
                const { element, connect, disconnect } = yield setup();
                const ariaInvalid = "spelling";
                element.ariaInvalid = ariaInvalid;
                yield connect();
                expect(
                    (_z =
                        (_y = element.shadowRoot) === null || _y === void 0
                            ? void 0
                            : _y.querySelector(".control")) === null || _z === void 0
                        ? void 0
                        : _z.getAttribute("aria-invalid")
                ).to.equal(ariaInvalid);
                yield disconnect();
            }));
        it("should set the `aria-keyshortcuts` attribute on the internal control when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _0, _1;
                const { element, connect, disconnect } = yield setup();
                const ariaKeyshortcuts = "F4";
                element.ariaKeyshortcuts = ariaKeyshortcuts;
                yield connect();
                expect(
                    (_1 =
                        (_0 = element.shadowRoot) === null || _0 === void 0
                            ? void 0
                            : _0.querySelector(".control")) === null || _1 === void 0
                        ? void 0
                        : _1.getAttribute("aria-keyshortcuts")
                ).to.equal(ariaKeyshortcuts);
                yield disconnect();
            }));
        it("should set the `aria-label` attribute on the internal control when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _2, _3;
                const { element, connect, disconnect } = yield setup();
                const ariaLabel = "Foo label";
                element.ariaLabel = ariaLabel;
                yield connect();
                expect(
                    (_3 =
                        (_2 = element.shadowRoot) === null || _2 === void 0
                            ? void 0
                            : _2.querySelector(".control")) === null || _3 === void 0
                        ? void 0
                        : _3.getAttribute("aria-label")
                ).to.equal(ariaLabel);
                yield disconnect();
            }));
        it("should set the `aria-labelledby` attribute on the internal control when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _4, _5;
                const { element, connect, disconnect } = yield setup();
                const ariaLabelledby = "testId";
                element.ariaLabelledby = ariaLabelledby;
                yield connect();
                expect(
                    (_5 =
                        (_4 = element.shadowRoot) === null || _4 === void 0
                            ? void 0
                            : _4.querySelector(".control")) === null || _5 === void 0
                        ? void 0
                        : _5.getAttribute("aria-labelledby")
                ).to.equal(ariaLabelledby);
                yield disconnect();
            }));
        it("should set the `aria-live` attribute on the internal control when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _6, _7;
                const { element, connect, disconnect } = yield setup();
                const ariaLive = "polite";
                element.ariaLive = ariaLive;
                yield connect();
                expect(
                    (_7 =
                        (_6 = element.shadowRoot) === null || _6 === void 0
                            ? void 0
                            : _6.querySelector(".control")) === null || _7 === void 0
                        ? void 0
                        : _7.getAttribute("aria-live")
                ).to.equal(ariaLive);
                yield disconnect();
            }));
        it("should set the `aria-owns` attribute on the internal control when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _8, _9;
                const { element, connect, disconnect } = yield setup();
                const ariaOwns = "testId";
                element.ariaOwns = ariaOwns;
                yield connect();
                expect(
                    (_9 =
                        (_8 = element.shadowRoot) === null || _8 === void 0
                            ? void 0
                            : _8.querySelector(".control")) === null || _9 === void 0
                        ? void 0
                        : _9.getAttribute("aria-owns")
                ).to.equal(ariaOwns);
                yield disconnect();
            }));
        it("should set the `aria-relevant` attribute on the internal control when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _10, _11;
                const { element, connect, disconnect } = yield setup();
                const ariaRelevant = "removals";
                element.ariaRelevant = ariaRelevant;
                yield connect();
                expect(
                    (_11 =
                        (_10 = element.shadowRoot) === null || _10 === void 0
                            ? void 0
                            : _10.querySelector(".control")) === null || _11 === void 0
                        ? void 0
                        : _11.getAttribute("aria-relevant")
                ).to.equal(ariaRelevant);
                yield disconnect();
            }));
        it("should set the `aria-roledescription` attribute on the internal control when provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _12, _13;
                const { element, connect, disconnect } = yield setup();
                const ariaRoledescription = "slide";
                element.ariaRoledescription = ariaRoledescription;
                yield connect();
                expect(
                    (_13 =
                        (_12 = element.shadowRoot) === null || _12 === void 0
                            ? void 0
                            : _12.querySelector(".control")) === null || _13 === void 0
                        ? void 0
                        : _13.getAttribute("aria-roledescription")
                ).to.equal(ariaRoledescription);
                yield disconnect();
            }));
    });
    describe("events", () => {
        it("should fire a change event the internal control emits a change event", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const { element, connect, disconnect } = yield setup();
                const event = new Event("change", {
                    key: "1",
                });
                let wasChanged = false;
                yield connect();
                element.addEventListener("change", e => {
                    e.preventDefault();
                    wasChanged = true;
                });
                let textarea =
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector("input");
                textarea === null || textarea === void 0
                    ? void 0
                    : textarea.dispatchEvent(event);
                expect(wasChanged).to.equal(true);
                yield disconnect();
            }));
        it("should fire an input event when incrementing or decrementing", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                let wasInput = false;
                element.addEventListener("input", e => {
                    e.preventDefault();
                    wasInput = true;
                });
                yield connect();
                element.stepUp();
                expect(wasInput).to.equal(true);
                wasInput = false;
                element.stepDown();
                expect(wasInput).to.equal(true);
                yield disconnect();
            }));
    });
    describe("when the owning form's reset() method is invoked", () => {
        it("should reset it's value property to an empty string if no value attribute is set", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, parent } = yield setup();
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                element.value = "10";
                assert(element.getAttribute("value") === null);
                assert(element.value === "10");
                form.reset();
                assert(element.value === "");
                yield disconnect();
            }));
        it("should reset it's value property to the value of the value attribute if it is set", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, parent } = yield setup();
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                element.setAttribute("value", "10");
                element.value = "20";
                assert(element.getAttribute("value") === "10");
                assert(element.value === "20");
                form.reset();
                assert(element.value === "10");
                yield disconnect();
            }));
        it("should put the control into a clean state, where value attribute changes change the property value prior to user or programmatic interaction", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, parent } = yield setup();
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                element.value = "10";
                element.setAttribute("value", "20");
                assert(element.value === "10");
                form.reset();
                assert(element.value === "20");
                element.setAttribute("value", "30");
                assert(element.value === "30");
                yield disconnect();
            }));
    });
    describe("min and max values", () => {
        it("should set min value", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                const { element, connect, disconnect } = yield setup();
                const min = 1;
                element.min = min;
                yield connect();
                expect(
                    (_b =
                        (_a = element.shadowRoot) === null || _a === void 0
                            ? void 0
                            : _a.querySelector(".control")) === null || _b === void 0
                        ? void 0
                        : _b.getAttribute("min")
                ).to.equal(min.toString());
                yield disconnect();
            }));
        it("should set max value", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _c, _d;
                const { element, connect, disconnect } = yield setup();
                const max = 10;
                element.max = max;
                yield connect();
                expect(
                    (_d =
                        (_c = element.shadowRoot) === null || _c === void 0
                            ? void 0
                            : _c.querySelector(".control")) === null || _d === void 0
                        ? void 0
                        : _d.getAttribute("max")
                ).to.equal(max.toString());
                yield disconnect();
            }));
        it("should set value to max when value is greater than max", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                const max = 10;
                element.max = max;
                element.setAttribute("value", `${max + 10}`);
                yield connect();
                expect(element.value).to.equal(max.toString());
                yield disconnect();
            }));
        it("should set value to min when value is less than min", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                const min = 10;
                element.min = min;
                element.setAttribute("value", `${min - 10}`);
                yield connect();
                expect(element.value).to.equal(min.toString());
                yield disconnect();
            }));
        it("should set max to highest when min is greater than max", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _e, _f;
                const { element, connect, disconnect } = yield setup();
                const min = 10;
                const max = 1;
                element.min = min;
                element.max = max;
                yield connect();
                expect(
                    (_f =
                        (_e = element.shadowRoot) === null || _e === void 0
                            ? void 0
                            : _e.querySelector(".control")) === null || _f === void 0
                        ? void 0
                        : _f.getAttribute("max")
                ).to.equal(min.toString());
                yield disconnect();
            }));
        it("should set step to a default of 1", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _g, _h;
                const { element, connect, disconnect } = yield setup();
                const step = 1;
                yield connect();
                expect(
                    (_h =
                        (_g = element.shadowRoot) === null || _g === void 0
                            ? void 0
                            : _g.querySelector(".control")) === null || _h === void 0
                        ? void 0
                        : _h.getAttribute("step")
                ).to.equal(step.toString());
                yield disconnect();
            }));
        it("should update step", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _j, _k;
                const { element, connect, disconnect } = yield setup();
                const step = 2;
                element.step = step;
                yield connect();
                expect(
                    (_k =
                        (_j = element.shadowRoot) === null || _j === void 0
                            ? void 0
                            : _j.querySelector(".control")) === null || _k === void 0
                        ? void 0
                        : _k.getAttribute("step")
                ).to.equal(step.toString());
                yield disconnect();
            }));
        it("should increment the value by the step amount", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                const step = 2;
                const value = 5;
                element.step = step;
                element.value = `${value}`;
                element.stepUp();
                yield connect();
                expect(element.value).to.equal(`${value + step}`);
                yield disconnect();
            }));
        it("should decrement the value by the step amount", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                const step = 2;
                const value = 5;
                element.step = step;
                element.value = `${value}`;
                element.stepDown();
                yield connect();
                expect(element.value).to.equal(`${value - step}`);
                yield disconnect();
            }));
        it("should increment no value to the step amount", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                const step = 2;
                element.step = step;
                element.stepUp();
                yield connect();
                expect(element.value).to.equal(`${step}`);
                yield disconnect();
            }));
        it("should decrement no value to the negative step amount", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                const step = 2;
                element.step = step;
                element.stepDown();
                yield connect();
                expect(element.value).to.equal(`${0 - step}`);
                yield disconnect();
            }));
    });
    describe("hide step", () => {
        it("should not render step controls when `hide-step` attribute is present", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                const { element, connect, disconnect } = yield setup();
                yield connect();
                expect(
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector(".controls")
                ).not.to.equal(null);
                element.setAttribute("hide-step", "");
                yield DOM.nextUpdate();
                expect(
                    (_b = element.shadowRoot) === null || _b === void 0
                        ? void 0
                        : _b.querySelector(".controls")
                ).to.equal(null);
                yield disconnect();
            }));
    });
});
