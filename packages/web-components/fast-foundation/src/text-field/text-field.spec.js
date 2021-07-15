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
import { expect, assert } from "chai";
import { fixture } from "../test-utilities/fixture";
import { TextField, textFieldTemplate as template } from "./index";
import { TextFieldType } from "./text-field";
const FASTTextField = TextField.compose({
    baseName: "text-field",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect, parent } = yield fixture(FASTTextField());
        return { element, connect, disconnect, parent };
    });
}
describe("TextField", () => {
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
    it("should set the `spellcheck` attribute on the internal control equal to the value provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _u, _v;
            const { element, connect, disconnect } = yield setup();
            const spellcheck = true;
            element.spellcheck = spellcheck;
            yield connect();
            expect(
                (_v =
                    (_u = element.shadowRoot) === null || _u === void 0
                        ? void 0
                        : _u.querySelector(".control")) === null || _v === void 0
                    ? void 0
                    : _v.hasAttribute("spellcheck")
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
            element.setAttribute("value", "foobar");
            yield connect();
            expect(element.value).to.equal("foobar");
            yield disconnect();
        }));
    it("should initialize to the provided value attribute if set post-connection", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            element.setAttribute("value", "foobar");
            expect(element.value).to.equal("foobar");
            yield disconnect();
        }));
    it("should initialize to the provided value property if set pre-connection", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.value = "foobar";
            yield connect();
            expect(element.value).to.equal("foobar");
            yield disconnect();
        }));
    it("should hide the label when start content is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _w, _x;
            const { element, connect, disconnect } = yield setup();
            const div = document.createElement("svg");
            div.setAttribute("height", "100px");
            div.setAttribute("width", "100px");
            yield connect();
            div.slot = "start";
            element.appendChild(div);
            expect(
                (_x =
                    (_w = element.shadowRoot) === null || _w === void 0
                        ? void 0
                        : _w.querySelector("label")) === null || _x === void 0
                    ? void 0
                    : _x.classList.contains("label__hidden")
            ).to.be.true;
            yield disconnect();
        }));
    it("should hide the label when end content is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _y, _z;
            const { element, connect, disconnect } = yield setup();
            const div = document.createElement("svg");
            div.setAttribute("height", "100px");
            div.setAttribute("width", "100px");
            yield connect();
            div.slot = "end";
            element.appendChild(div);
            expect(
                (_z =
                    (_y = element.shadowRoot) === null || _y === void 0
                        ? void 0
                        : _y.querySelector("label")) === null || _z === void 0
                    ? void 0
                    : _z.classList.contains("label__hidden")
            ).to.be.true;
            yield disconnect();
        }));
    it("should hide the label when start and end content are provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _0, _1;
            const { element, connect, disconnect } = yield setup();
            const div = document.createElement("svg");
            div.setAttribute("height", "100px");
            div.setAttribute("width", "100px");
            const div2 = div;
            yield connect();
            div.slot = "start";
            div2.slot = "end";
            element.appendChild(div);
            element.appendChild(div2);
            expect(
                (_1 =
                    (_0 = element.shadowRoot) === null || _0 === void 0
                        ? void 0
                        : _0.querySelector("label")) === null || _1 === void 0
                    ? void 0
                    : _1.classList.contains("label__hidden")
            ).to.be.true;
            yield disconnect();
        }));
    it("should hide the label when whitespace only text nodes are slotted", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _2, _3;
            const { element, connect, disconnect } = yield setup();
            const whitespace = document.createTextNode(" ");
            const whitespace2 = document.createTextNode(" \r ");
            yield connect();
            element.appendChild(whitespace);
            element.appendChild(whitespace2);
            expect(
                (_3 =
                    (_2 = element.shadowRoot) === null || _2 === void 0
                        ? void 0
                        : _2.querySelector("label")) === null || _3 === void 0
                    ? void 0
                    : _3.classList.contains("label__hidden")
            ).to.be.true;
            yield disconnect();
        }));
    it("should hide the label when no default slotted content is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _4, _5;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_5 =
                    (_4 = element.shadowRoot) === null || _4 === void 0
                        ? void 0
                        : _4.querySelector("label")) === null || _5 === void 0
                    ? void 0
                    : _5.classList.contains("label__hidden")
            ).to.be.true;
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
                    key: "a",
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
    });
    describe("with constraint validation", () => {
        Object.keys(TextFieldType)
            .map(key => TextFieldType[key])
            .forEach(type => {
                describe(`of [type="${type}"]`, () => {
                    describe("that is [required]", () => {
                        it("should be invalid when it's value property is an empty string", () =>
                            __awaiter(void 0, void 0, void 0, function* () {
                                const { element, connect, disconnect } = yield setup();
                                yield connect();
                                element.type = type;
                                element.required = true;
                                element.value = "";
                                expect(element.validity.valueMissing).to.equal(true);
                                yield disconnect();
                            }));
                        it("should be valid when value property is a string that is non-empty", () =>
                            __awaiter(void 0, void 0, void 0, function* () {
                                const { element, connect, disconnect } = yield setup();
                                yield connect();
                                element.type = type;
                                element.required = true;
                                element.value = "some value";
                                expect(element.validity.valueMissing).to.equal(false);
                                yield disconnect();
                            }));
                    });
                    describe("that has a [minlength] attribute", () => {
                        it("should be valid if the value is an empty string", () =>
                            __awaiter(void 0, void 0, void 0, function* () {
                                const { element, connect, disconnect } = yield setup();
                                yield connect();
                                const value = "";
                                element.type = type;
                                element.value = value;
                                element.minlength = value.length + 1;
                                expect(element.validity.tooShort).to.equal(false);
                                yield disconnect();
                            }));
                        it("should be valid if the value has a length less than the minlength", () =>
                            __awaiter(void 0, void 0, void 0, function* () {
                                const { element, connect, disconnect } = yield setup();
                                yield connect();
                                const value = "value";
                                element.type = type;
                                element.value = value;
                                element.minlength = value.length + 1;
                                expect(element.validity.tooShort).to.equal(false);
                                yield disconnect();
                            }));
                    });
                    describe("that has a [maxlength] attribute", () => {
                        it("should be valid if the value is an empty string", () =>
                            __awaiter(void 0, void 0, void 0, function* () {
                                const { element, connect, disconnect } = yield setup();
                                yield connect();
                                const value = "";
                                element.type = type;
                                element.value = value;
                                element.maxlength = value.length;
                                expect(element.validity.tooLong).to.equal(false);
                                yield disconnect();
                            }));
                        it("should be valid if the value has a exceeding the maxlength", () =>
                            __awaiter(void 0, void 0, void 0, function* () {
                                const { element, connect, disconnect } = yield setup();
                                yield connect();
                                const value = "value";
                                element.type = type;
                                element.value = value;
                                element.maxlength = value.length - 1;
                                expect(element.validity.tooLong).to.equal(false);
                                yield disconnect();
                            }));
                        it("should be valid if the value has a length shorter than maxlength and the element is [required]", () =>
                            __awaiter(void 0, void 0, void 0, function* () {
                                const { element, connect, disconnect } = yield setup();
                                yield connect();
                                const value = "value";
                                element.type = type;
                                element.required = true;
                                element.value = value;
                                element.maxlength = value.length + 1;
                                expect(element.validity.tooLong).to.equal(false);
                                yield disconnect();
                            }));
                    });
                    describe("that has a [pattern] attribute", () => {
                        it("should be valid if the value matches a pattern", () =>
                            __awaiter(void 0, void 0, void 0, function* () {
                                const { element, connect, disconnect } = yield setup();
                                yield connect();
                                const value = "value";
                                element.type = type;
                                element.required = true;
                                element.pattern = value;
                                element.value = value;
                                expect(element.validity.patternMismatch).to.equal(false);
                                yield disconnect();
                            }));
                        it("should be invalid if the value does not match a pattern", () =>
                            __awaiter(void 0, void 0, void 0, function* () {
                                const { element, connect, disconnect } = yield setup();
                                yield connect();
                                const value = "value";
                                element.type = type;
                                element.required = true;
                                element.pattern = value;
                                element.value = "foo";
                                expect(element.validity.patternMismatch).to.equal(true);
                                yield disconnect();
                            }));
                    });
                });
            });
        describe('of [type="email"]', () => {
            it("should be valid when value is an empty string", () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const { element, connect, disconnect } = yield setup();
                    yield connect();
                    element.type = TextFieldType.email;
                    element.required = true;
                    element.value = "";
                    expect(element.validity.typeMismatch).to.equal(false);
                    yield disconnect();
                }));
            it("should be a typeMismatch when value is not a valid email", () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const { element, connect, disconnect } = yield setup();
                    yield connect();
                    element.type = TextFieldType.email;
                    element.required = true;
                    element.value = "foobar";
                    expect(element.validity.typeMismatch).to.equal(true);
                    yield disconnect();
                }));
        });
        describe('of [type="url"]', () => {
            it("should be valid when value is an empty string", () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const { element, connect, disconnect } = yield setup();
                    yield connect();
                    element.type = TextFieldType.url;
                    element.required = true;
                    element.value = "";
                    expect(element.validity.typeMismatch).to.equal(false);
                    yield disconnect();
                }));
            it("should be a typeMismatch when value is not a valid URL", () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const { element, connect, disconnect } = yield setup();
                    yield connect();
                    element.type = TextFieldType.url;
                    element.required = true;
                    element.value = "foobar";
                    expect(element.validity.typeMismatch).to.equal(true);
                    yield disconnect();
                }));
        });
    });
    describe("when the owning form's reset() method is invoked", () => {
        it("should reset it's value property to an empty string if no value attribute is set", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, parent } = yield setup();
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                element.value = "test-value";
                assert(element.getAttribute("value") === null);
                assert(element.value === "test-value");
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
                element.setAttribute("value", "attr-value");
                element.value = "test-value";
                assert(element.getAttribute("value") === "attr-value");
                assert(element.value === "test-value");
                form.reset();
                assert(element.value === "attr-value");
                yield disconnect();
            }));
        it("should put the control into a clean state, where value attribute changes change the property value prior to user or programmatic interaction", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, parent } = yield setup();
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                element.value = "test-value";
                element.setAttribute("value", "attr-value");
                assert(element.value === "test-value");
                form.reset();
                assert(element.value === "attr-value");
                element.setAttribute("value", "new-attr-value");
                assert(element.value === "new-attr-value");
                yield disconnect();
            }));
    });
});
