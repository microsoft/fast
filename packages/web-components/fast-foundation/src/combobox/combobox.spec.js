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
import { DOM } from "@microsoft/fast-element";
import { listboxOptionTemplate, ListboxOption } from "../listbox-option";
import { fixture } from "../test-utilities/fixture";
import { Combobox, comboboxTemplate as template } from "./index";
import { KeyCodes } from "@microsoft/fast-web-utilities";
const FASTCombobox = Combobox.compose({
    baseName: "combobox",
    template,
});
const FASTOption = ListboxOption.compose({
    baseName: "option",
    template: listboxOptionTemplate,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect, parent } = yield fixture([
            FASTCombobox(),
            FASTOption(),
        ]);
        const option1 = document.createElement("fast-option");
        option1.textContent = "one";
        const option2 = document.createElement("fast-option");
        option2.textContent = "two";
        const option3 = document.createElement("fast-option");
        option3.textContent = "three";
        element.appendChild(option1);
        element.appendChild(option2);
        element.appendChild(option3);
        return {
            element,
            connect,
            disconnect,
            document,
            option1,
            option2,
            option3,
            parent,
        };
    });
}
// TODO: Need to add tests for keyboard handling & focus management
describe("Combobox", () => {
    it("should include a control with a role of `combobox`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            assert.strictEqual(element.control.getAttribute("role"), "combobox");
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
    it("should have a tabindex of 0 when `disabled` is not defined", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("tabindex")).to.equal("0");
            yield disconnect();
        }));
    it("should NOT have a tabindex when `disabled` is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.disabled = true;
            yield connect();
            expect(element.getAttribute("tabindex")).to.equal(null);
            yield disconnect();
        }));
    it("should NOT set its value to the first available option", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.value).to.equal("");
            yield disconnect();
        }));
    it("should set its value to the first option with the `selected` attribute present", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect, option2 } = yield setup();
            option2.setAttribute("selected", "");
            expect(option2.selected).to.be.true;
            yield connect();
            expect(element.value).to.equal("two");
            yield disconnect();
        }));
    it("should return the same value when the value property is set before connect", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.value = "two";
            expect(element.value).to.equal("two");
            yield connect();
            yield disconnect();
        }));
    it("should return the same value when the value property is set after connect", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            element.value = "two";
            expect(element.value).to.equal("two");
            yield disconnect();
        }));
    describe("should NOT emit a 'change' event when the value changes by user input while open", () => {
        it("via arrow down key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                yield connect();
                element.click();
                expect(element.open).to.be.true;
                const event = new KeyboardEvent("keydown", {
                    key: "ArrowDown",
                    keyCode: KeyCodes.arrowDown,
                });
                const wasChanged = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("change", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    DOM.nextUpdate().then(() => false),
                ]);
                expect(wasChanged).to.be.false;
                yield disconnect();
            }));
        it("via arrow up key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                yield connect();
                element.value = "two";
                expect(element.value).to.equal("two");
                element.click();
                expect(element.open).to.be.true;
                const event = new KeyboardEvent("keydown", {
                    key: "ArrowUp",
                    keyCode: KeyCodes.arrowUp,
                });
                const wasChanged = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("change", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    DOM.nextUpdate().then(() => false),
                ]);
                expect(wasChanged).to.be.false;
                expect(element.value).to.equal("two");
                yield disconnect();
            }));
    });
    describe("should NOT emit a 'change' event when the value changes by programmatic interaction", () => {
        it("via end key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.value = "one";
                yield connect();
                expect(element.value).to.equal("one");
                const wasChanged = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("change", () => resolve(true));
                        element.value = "two";
                    }),
                    DOM.nextUpdate().then(() => false),
                ]);
                expect(wasChanged).to.be.false;
                expect(element.value).to.equal("two");
                yield disconnect();
            }));
    });
    it("should set the `placeholder` attribute on the internal control equal to the value provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { element, connect, disconnect } = yield setup();
            const placeholder = "placeholder";
            element.placeholder = placeholder;
            yield connect();
            expect(
                (_b =
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector(".selected-value")) === null || _b === void 0
                    ? void 0
                    : _b.getAttribute("placeholder")
            ).to.equal(placeholder);
            yield disconnect();
        }));
    describe("when the owning form's reset() function is invoked", () => {
        it("should reset the value property to its initial value", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element, parent } = yield setup();
                element.value = "one";
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                element.value = "two";
                expect(element.value).to.equal("two");
                form.reset();
                expect(element.value).to.equal("one");
                yield disconnect();
            }));
        it("should reset its value property to the first option with the `selected` attribute present", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, parent, option2 } = yield setup();
                option2.setAttribute("selected", "");
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                expect(element.value).to.equal("two");
                element.value = "one";
                expect(element.value).to.equal("one");
                form.reset();
                yield DOM.nextUpdate();
                expect(element.value).to.equal("two");
                yield disconnect();
            }));
    });
});
