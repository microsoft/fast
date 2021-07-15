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
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { fixture } from "../test-utilities/fixture";
import { ListboxOption, listboxOptionTemplate } from "../listbox-option";
import { timeout } from "../test-utilities/timeout";
import { Select, selectTemplate as template } from "./index";
const FASTSelect = Select.compose({
    baseName: "select",
    template,
});
const FASTOption = ListboxOption.compose({
    baseName: "option",
    template: listboxOptionTemplate,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect, parent } = yield fixture([
            FASTSelect(),
            FASTOption(),
        ]);
        const option1 = document.createElement("fast-option");
        option1.value = "one";
        const option2 = document.createElement("fast-option");
        option2.value = "two";
        const option3 = document.createElement("fast-option");
        option3.value = "three";
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
describe("Select", () => {
    it("should include a role of `combobox`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            assert.strictEqual(element.getAttribute("role"), "combobox");
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
    it("should have the attribute aria-expanded set to false", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("aria-expanded")).to.equal("false");
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
    it("should set its value to the first enabled option", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const {
                element,
                connect,
                disconnect,
                option1,
                option2,
                option3,
            } = yield setup();
            yield connect();
            expect(element.value).to.equal("one");
            expect(element.selectedIndex).to.equal(0);
            expect(element.selectedOptions).to.contain(option1);
            expect(element.selectedOptions).to.not.contain(option2);
            expect(element.selectedOptions).to.not.contain(option3);
            yield disconnect();
        }));
    it("should select the first option with a `selected` attribute", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const {
                element,
                connect,
                disconnect,
                option1,
                option2,
                option3,
            } = yield setup();
            option2.setAttribute("selected", "");
            yield connect();
            expect(element.value).to.equal("two");
            expect(element.selectedIndex).to.equal(1);
            expect(element.selectedOptions).to.not.contain(option1);
            expect(element.selectedOptions).to.contain(option2);
            expect(element.selectedOptions).to.not.contain(option3);
            yield disconnect();
        }));
    it("should return the same value when the value property is set before connect", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element } = yield setup();
            element.value = "two";
            expect(element.value).to.equal("two");
        }));
    it("should return the same value when the value property is set after connect", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            element.value = "two";
            expect(element.value).to.equal("two");
            yield disconnect();
        }));
    it("should update the aria-expanded attribute when opened", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            element.click();
            yield DOM.nextUpdate();
            expect(element.getAttribute("aria-expanded")).to.equal("true");
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
                expect(element.value).to.equal("two");
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
                expect(element.value).to.equal("one");
                yield disconnect();
            }));
        it("via home key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                yield connect();
                element.click();
                expect(element.open).to.be.true;
                const event = new KeyboardEvent("keydown", {
                    key: "Home",
                    keyCode: KeyCodes.home,
                });
                const wasChanged = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("change", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    DOM.nextUpdate().then(() => false),
                ]);
                expect(wasChanged).to.be.false;
                expect(element.value).to.equal("one");
                yield disconnect();
            }));
        it("via end key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.value = "one";
                yield connect();
                element.click();
                expect(element.open).to.be.true;
                const event = new KeyboardEvent("keydown", {
                    key: "End",
                    keyCode: KeyCodes.end,
                });
                const wasChanged = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("change", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    DOM.nextUpdate().then(() => false),
                ]);
                expect(wasChanged).to.be.false;
                expect(element.value).to.equal("three");
                yield disconnect();
            }));
    });
    describe("should NOT emit an 'input' event when the value changes by user input while open", () => {
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
                const wasInput = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("input", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    timeout().then(() => false),
                ]);
                expect(wasInput).to.be.false;
                expect(element.value).to.equal("two");
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
                const wasInput = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("input", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    timeout().then(() => false),
                ]);
                expect(wasInput).to.be.false;
                expect(element.value).to.equal("one");
                yield disconnect();
            }));
        it("via home key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                yield connect();
                element.click();
                expect(element.open).to.be.true;
                const event = new KeyboardEvent("keydown", {
                    key: "Home",
                    keyCode: KeyCodes.home,
                });
                const wasInput = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("input", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    timeout().then(() => false),
                ]);
                expect(wasInput).to.be.false;
                expect(element.value).to.equal("one");
                yield disconnect();
            }));
        it("via end key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.value = "one";
                yield connect();
                element.click();
                expect(element.open).to.be.true;
                const event = new KeyboardEvent("keydown", {
                    key: "End",
                    keyCode: KeyCodes.end,
                });
                const wasInput = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("input", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    timeout().then(() => false),
                ]);
                expect(wasInput).to.be.false;
                expect(element.value).to.equal("three");
                yield disconnect();
            }));
    });
    describe("should emit a 'change' event when the value changes by user input while closed", () => {
        it("via arrow down key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.value = "one";
                yield connect();
                expect(element.value).to.equal("one");
                expect(element.open).to.be.false;
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
                expect(wasChanged).to.be.true;
                expect(element.value).to.equal("two");
                yield disconnect();
            }));
        it("via arrow up key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                yield connect();
                element.value = "two";
                expect(element.value).to.equal("two");
                expect(element.open).to.be.false;
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
                expect(wasChanged).to.be.true;
                expect(element.value).to.equal("one");
                yield disconnect();
            }));
        it("via home key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                yield connect();
                element.value = "three";
                expect(element.value).to.equal("three");
                expect(element.open).to.be.false;
                const event = new KeyboardEvent("keydown", {
                    key: "Home",
                    keyCode: KeyCodes.home,
                });
                const wasChanged = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("change", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    DOM.nextUpdate().then(() => false),
                ]);
                expect(wasChanged).to.be.true;
                expect(element.value).to.equal("one");
                yield disconnect();
            }));
        it("via end key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                yield connect();
                expect(element.open).to.be.false;
                const event = new KeyboardEvent("keydown", {
                    key: "End",
                    keyCode: KeyCodes.end,
                });
                const wasChanged = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("change", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    DOM.nextUpdate().then(() => false),
                ]);
                expect(wasChanged).to.be.true;
                expect(element.value).to.equal("three");
                yield disconnect();
            }));
        it("with a sequence of directional inputs", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                yield connect();
                element.value = "two";
                expect(element.value).to.equal("two");
                element.click();
                element.click();
                expect(element.open).to.be.false;
                const arrowDownEvent = new KeyboardEvent("keydown", {
                    key: "ArrowDown",
                    keyCode: KeyCodes.arrowDown,
                });
                const arrowUpEvent = new KeyboardEvent("keydown", {
                    key: "ArrowUp",
                    keyCode: KeyCodes.arrowUp,
                });
                expect(
                    yield Promise.race([
                        new Promise(resolve => {
                            element.addEventListener("change", () => resolve(true), {
                                once: true,
                            });
                            element.dispatchEvent(arrowUpEvent);
                        }),
                        timeout().then(() => false),
                    ])
                ).to.be.true;
                expect(element.value).to.equal("one");
                expect(
                    yield Promise.race([
                        new Promise(resolve => {
                            element.addEventListener("change", () => resolve(true), {
                                once: true,
                            });
                            element.dispatchEvent(arrowDownEvent);
                        }),
                        timeout().then(() => false),
                    ])
                ).to.be.true;
                expect(element.value).to.equal("two");
                yield disconnect();
            });
        });
    });
    describe("should emit an 'input' event when the value changes by user input while closed", () => {
        it("via arrow down key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                element.value = "one";
                yield connect();
                expect(element.value).to.equal("one");
                expect(element.open).to.be.false;
                const event = new KeyboardEvent("keydown", {
                    key: "ArrowDown",
                    keyCode: KeyCodes.arrowDown,
                });
                const wasInput = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("input", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    timeout().then(() => false),
                ]);
                expect(wasInput).to.be.true;
                expect(element.value).to.equal("two");
                yield disconnect();
            }));
        it("via arrow up key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                yield connect();
                element.value = "two";
                expect(element.value).to.equal("two");
                expect(element.open).to.be.false;
                const event = new KeyboardEvent("keydown", {
                    key: "ArrowUp",
                    keyCode: KeyCodes.arrowUp,
                });
                const wasInput = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("input", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    timeout().then(() => false),
                ]);
                expect(wasInput).to.be.true;
                expect(element.value).to.equal("one");
                yield disconnect();
            }));
        it("via home key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                yield connect();
                element.value = "three";
                expect(element.value).to.equal("three");
                expect(element.open).to.be.false;
                const event = new KeyboardEvent("keydown", {
                    key: "Home",
                    keyCode: KeyCodes.home,
                });
                const wasInput = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("input", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    timeout().then(() => false),
                ]);
                expect(wasInput).to.be.true;
                expect(element.value).to.equal("one");
                yield disconnect();
            }));
        it("via end key", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                yield connect();
                expect(element.open).to.be.false;
                const event = new KeyboardEvent("keydown", {
                    key: "End",
                    keyCode: KeyCodes.end,
                });
                const wasInput = yield Promise.race([
                    new Promise(resolve => {
                        element.addEventListener("input", () => resolve(true));
                        element.dispatchEvent(event);
                    }),
                    timeout().then(() => false),
                ]);
                expect(wasInput).to.be.true;
                expect(element.value).to.equal("three");
                yield disconnect();
            }));
    });
    it("should NOT emit a 'change' event when the value changes by programmatic interaction", () =>
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
    it("should NOT emit an 'input' event when the value changes by programmatic interaction", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.value = "one";
            yield connect();
            expect(element.value).to.equal("one");
            const wasChanged = yield Promise.race([
                new Promise(resolve => {
                    element.addEventListener("input", () => resolve(true));
                    element.value = "two";
                }),
                DOM.nextUpdate().then(() => false),
            ]);
            expect(wasChanged).to.be.false;
            expect(element.value).to.equal("two");
            yield disconnect();
        }));
    describe("when the owning form's reset() function is invoked", () => {
        it("should reset the value property to the first enabled option", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element, parent } = yield setup();
                element.value = "one";
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                expect(element.value).to.equal("one");
                element.value = "two";
                expect(element.value).to.equal("two");
                form.reset();
                expect(element.value).to.equal("one");
                yield disconnect();
            }));
    });
});
