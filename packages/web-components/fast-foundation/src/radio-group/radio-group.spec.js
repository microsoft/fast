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
import { assert, expect } from "chai";
import { RadioGroup, radioGroupTemplate as template } from "./index";
import { Radio, radioTemplate as itemTemplate } from "../radio";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
const FASTRadioGroup = RadioGroup.compose({
    baseName: "radio-group",
    template,
});
const FASTRadio = Radio.compose({
    baseName: "radio",
    template,
});
// TODO: Need to add tests for keyboard handling & focus management
describe("Radio Group", () => {
    const FASTRadio = Radio.compose({
        baseName: "radio",
        template: itemTemplate,
    });
    function setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const { element, connect, disconnect, parent } = yield fixture([
                FASTRadioGroup(),
                FASTRadio(),
            ]);
            const radio1 = document.createElement("fast-radio");
            const radio2 = document.createElement("fast-radio");
            const radio3 = document.createElement("fast-radio");
            radio1.className = "one";
            radio2.className = "two";
            radio3.className = "three";
            element.appendChild(radio1);
            element.appendChild(radio2);
            element.appendChild(radio3);
            return { element, connect, disconnect, parent, radio1, radio2, radio3 };
        });
    }
    it("should have a role of `radiogroup`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("role")).to.equal("radiogroup");
            yield disconnect();
        }));
    it("should set a `horizontal` class on the 'positioning-region' when an orientation of `horizontal` is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { element, connect, disconnect } = yield setup();
            element.orientation = Orientation.horizontal;
            yield connect();
            expect(
                (_b =
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector(".positioning-region")) === null ||
                    _b === void 0
                    ? void 0
                    : _b.classList.contains("horizontal")
            ).to.equal(true);
            yield disconnect();
        }));
    it("should set a `vertical` class on the 'positioning-region' when an orientation of `vertical` is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            const { element, connect, disconnect } = yield setup();
            element.orientation = Orientation.vertical;
            yield connect();
            expect(
                (_d =
                    (_c = element.shadowRoot) === null || _c === void 0
                        ? void 0
                        : _c.querySelector(".positioning-region")) === null ||
                    _d === void 0
                    ? void 0
                    : _d.classList.contains("vertical")
            ).to.equal(true);
            yield disconnect();
        }));
    it("should set a default class on the 'positioning-region' of `horizontal` when no orientation is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_f =
                    (_e = element.shadowRoot) === null || _e === void 0
                        ? void 0
                        : _e.querySelector(".positioning-region")) === null ||
                    _f === void 0
                    ? void 0
                    : _f.classList.contains("horizontal")
            ).to.equal(true);
            yield disconnect();
        }));
    it("should set the `aria-disabled` attribute equal to the `disabled` value", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.disabled = true;
            yield connect();
            expect(element.getAttribute("aria-disabled")).to.equal("true");
            element.disabled = false;
            yield DOM.nextUpdate();
            expect(element.getAttribute("aria-disabled")).to.equal("false");
            yield disconnect();
        }));
    it("should NOT set a default `aria-disabled` value when `disabled` is not defined", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("aria-disabled")).to.equal(null);
            yield disconnect();
        }));
    it("should set all child radio elements to disabled when the`disabled` is passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _g, _h, _j;
            const { element, connect, disconnect } = yield setup();
            element.disabled = true;
            yield connect();
            yield DOM.nextUpdate();
            expect(element.querySelector(".one").disabled).to.equal(true);
            expect(element.querySelector(".two").disabled).to.equal(true);
            expect(element.querySelector(".three").disabled).to.equal(true);
            expect(
                (_g = element.querySelector(".one")) === null || _g === void 0
                    ? void 0
                    : _g.getAttribute("aria-disabled")
            ).to.equal("true");
            expect(
                (_h = element.querySelector(".two")) === null || _h === void 0
                    ? void 0
                    : _h.getAttribute("aria-disabled")
            ).to.equal("true");
            expect(
                (_j = element.querySelector(".three")) === null || _j === void 0
                    ? void 0
                    : _j.getAttribute("aria-disabled")
            ).to.equal("true");
            yield disconnect();
        }));
    it("should set the `aria-readonly` attribute equal to the `readonly` value", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield fixture(FASTRadioGroup());
            element.readOnly = true;
            yield connect();
            expect(element.getAttribute("aria-readonly")).to.equal("true");
            element.readOnly = false;
            yield DOM.nextUpdate();
            expect(element.getAttribute("aria-readonly")).to.equal("false");
            yield disconnect();
        }));
    it("should NOT set a default `aria-readonly` value when `readonly` is not defined", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield fixture(FASTRadioGroup());
            yield connect();
            expect(element.getAttribute("aria-readonly")).to.equal(null);
            yield disconnect();
        }));
    it("should set all child radio elements to readonly when the`readonly` is passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _k, _l, _m;
            const { element, connect, disconnect } = yield setup();
            element.readOnly = true;
            yield connect();
            yield DOM.nextUpdate();
            expect(element.querySelector(".one").readOnly).to.equal(true);
            expect(element.querySelector(".two").readOnly).to.equal(true);
            expect(element.querySelector(".three").readOnly).to.equal(true);
            expect(
                (_k = element.querySelector(".one")) === null || _k === void 0
                    ? void 0
                    : _k.getAttribute("aria-readonly")
            ).to.equal("true");
            expect(
                (_l = element.querySelector(".two")) === null || _l === void 0
                    ? void 0
                    : _l.getAttribute("aria-readonly")
            ).to.equal("true");
            expect(
                (_m = element.querySelector(".three")) === null || _m === void 0
                    ? void 0
                    : _m.getAttribute("aria-readonly")
            ).to.equal("true");
            yield disconnect();
        }));
    it("should set tabindex of 0 to a child radio with a matching `value`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect, parent } = yield fixture([
                FASTRadioGroup(),
                FASTRadio(),
            ]);
            element.value = "baz";
            const radio1 = document.createElement("fast-radio");
            const radio2 = document.createElement("fast-radio");
            const radio3 = document.createElement("fast-radio");
            radio1.className = "one";
            radio2.className = "two";
            radio3.className = "three";
            radio1.value = "foo";
            radio2.value = "bar";
            radio3.value = "baz";
            element.appendChild(radio1);
            element.appendChild(radio2);
            element.appendChild(radio3);
            yield connect();
            yield DOM.nextUpdate();
            expect(
                element.querySelectorAll("fast-radio")[2].getAttribute("tabindex")
            ).to.equal("0");
            yield disconnect();
        }));
    it("should NOT set tabindex of 0 to a child radio if its value does not match the radiogroup `value`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect, parent } = yield fixture([
                FASTRadioGroup(),
                FASTRadio(),
            ]);
            element.value = "baz";
            const radio1 = document.createElement("fast-radio");
            const radio2 = document.createElement("fast-radio");
            const radio3 = document.createElement("fast-radio");
            radio1.className = "one";
            radio2.className = "two";
            radio3.className = "three";
            radio1.value = "foo";
            radio2.value = "bar";
            radio3.value = "baz";
            element.appendChild(radio1);
            element.appendChild(radio2);
            element.appendChild(radio3);
            yield connect();
            yield DOM.nextUpdate();
            expect(
                element.querySelectorAll("fast-radio")[0].getAttribute("tabindex")
            ).to.equal("-1");
            expect(
                element.querySelectorAll("fast-radio")[1].getAttribute("tabindex")
            ).to.equal("-1");
            yield disconnect();
        }));
    it("should set a child radio with a matching `value` to `checked`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect, parent } = yield fixture([
                FASTRadioGroup(),
                FASTRadio(),
            ]);
            element.value = "baz";
            const radio1 = document.createElement("fast-radio");
            const radio2 = document.createElement("fast-radio");
            const radio3 = document.createElement("fast-radio");
            radio1.className = "one";
            radio2.className = "two";
            radio3.className = "three";
            radio1.value = "foo";
            radio2.value = "bar";
            radio3.value = "baz";
            element.appendChild(radio1);
            element.appendChild(radio2);
            element.appendChild(radio3);
            yield connect();
            yield DOM.nextUpdate();
            expect(element.querySelectorAll("fast-radio")[2].checked).to.equal(true);
            expect(
                element.querySelectorAll("fast-radio")[2].getAttribute("aria-checked")
            ).to.equal("true");
            yield disconnect();
        }));
    it("should mark the last radio defaulted to checked as checked, the rest should not be checked", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect, parent } = yield fixture([
                FASTRadioGroup(),
                FASTRadio(),
            ]);
            const radio1 = document.createElement("fast-radio");
            const radio2 = document.createElement("fast-radio");
            const radio3 = document.createElement("fast-radio");
            radio1.className = "one";
            radio2.className = "two";
            radio3.className = "three";
            radio1.value = "foo";
            radio2.value = "bar";
            radio3.value = "baz";
            radio2.setAttribute("checked", "");
            radio3.setAttribute("checked", "");
            element.appendChild(radio1);
            element.appendChild(radio2);
            element.appendChild(radio3);
            yield connect();
            yield DOM.nextUpdate();
            const radios = element.querySelectorAll("fast-radio");
            expect(radios[2].checked).to.equal(true);
            expect(radios[1].checked).to.equal(false);
            yield disconnect();
        }));
    it("should mark radio matching value on radio-group over any checked attributes", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect, parent } = yield fixture([
                FASTRadioGroup(),
                FASTRadio(),
            ]);
            element.value = "bar";
            const radio1 = document.createElement("fast-radio");
            const radio2 = document.createElement("fast-radio");
            const radio3 = document.createElement("fast-radio");
            radio1.className = "one";
            radio2.className = "two";
            radio3.className = "three";
            radio1.value = "foo";
            radio2.value = "bar";
            radio3.value = "baz";
            radio2.setAttribute("checked", "");
            radio3.setAttribute("checked", "");
            element.appendChild(radio1);
            element.appendChild(radio2);
            element.appendChild(radio3);
            yield connect();
            yield DOM.nextUpdate();
            const radios = element.querySelectorAll("fast-radio");
            expect(radios[1].checked).to.equal(true);
            // radio-group explicitly sets non-matching radio's checked to false if a value match was found,
            // but the attribute should still persist.
            expect(radios[2].hasAttribute("checked")).to.equal(true);
            expect(radios[2].checked).to.equal(false);
            yield disconnect();
        }));
    it("should NOT set a child radio to `checked` if its value does not match the radiogroup `value`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect, parent } = yield fixture([
                FASTRadioGroup(),
                FASTRadio(),
            ]);
            element.value = "baz";
            const radio1 = document.createElement("fast-radio");
            const radio2 = document.createElement("fast-radio");
            const radio3 = document.createElement("fast-radio");
            radio1.className = "one";
            radio2.className = "two";
            radio3.className = "three";
            radio1.value = "foo";
            radio2.value = "bar";
            radio3.value = "baz";
            element.appendChild(radio1);
            element.appendChild(radio2);
            element.appendChild(radio3);
            yield connect();
            yield DOM.nextUpdate();
            expect(element.querySelectorAll("fast-radio")[0].checked).to.equal(false);
            expect(
                element.querySelectorAll("fast-radio")[0].getAttribute("aria-checked")
            ).to.equal("false");
            expect(element.querySelectorAll("fast-radio")[1].checked).to.equal(false);
            expect(
                element.querySelectorAll("fast-radio")[1].getAttribute("aria-checked")
            ).to.equal("false");
            yield disconnect();
        }));
    it("should allow resetting of elements by the parent form", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const {
                element,
                connect,
                disconnect,
                parent,
                radio1,
                radio2,
                radio3,
            } = yield setup();
            radio2.setAttribute("checked", "");
            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);
            yield connect();
            radio1.checked = true;
            assert.isTrue(!!radio1.checked);
            assert.isFalse(!!radio2.checked);
            assert.isFalse(!!radio3.checked);
            form.reset();
            assert.isFalse(!!radio1.checked);
            assert.isTrue(!!radio2.checked);
            assert.isFalse(!!radio3.checked);
            yield disconnect();
        }));
});
