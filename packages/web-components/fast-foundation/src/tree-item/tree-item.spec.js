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
import { TreeItem, treeItemTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
const FASTTreeItem = TreeItem.compose({
    baseName: "tree-item",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture(FASTTreeItem());
        return { element, connect, disconnect };
    });
}
// TODO: Need to add tests for keyboard handling & focus management
describe("TreeItem", () => {
    it("should include a role of `treeitem`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("role")).to.equal("treeitem");
            yield disconnect();
        }));
    it("should set the `aria-expanded` attribute equal to the `expanded` value when the tree item has children", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const child = document.createElement("fast-tree-item");
            element.appendChild(child);
            element.expanded = true;
            yield connect();
            yield DOM.nextUpdate();
            expect(element.getAttribute("aria-expanded")).to.equal("true");
            yield disconnect();
        }));
    it("should NOT set the `aria-expanded` attribute if the tree item has no children", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("aria-expanded")).to.equal(null);
            yield disconnect();
        }));
    it("should NOT set the `aria-expanded` attribute if `expanded` value is true but the tree item has no children", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.expanded = true;
            yield connect();
            expect(element.getAttribute("aria-expanded")).to.equal(null);
            yield disconnect();
        }));
    it("should add a class of `expanded` when expanded is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.expanded = true;
            yield connect();
            expect(element.classList.contains("expanded")).to.equal(true);
            yield disconnect();
        }));
    it("should set the `aria-selected` attribute equal to the `selected` value", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.selected = true;
            yield connect();
            expect(element.getAttribute("aria-selected")).to.equal("true");
            element.selected = false;
            yield DOM.nextUpdate();
            expect(element.getAttribute("aria-selected")).to.equal("false");
            yield disconnect();
        }));
    it("should NOT set the `aria-selected` attribute if `selected` value is not provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.hasAttribute("aria-selected")).to.equal(false);
            yield disconnect();
        }));
    it("should add a class of `selected` when selected is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.selected = true;
            yield connect();
            expect(element.classList.contains("selected")).to.equal(true);
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
    it("should NOT set the `aria-disabled` attribute if `disabled` value is not provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.hasAttribute("aria-disabled")).to.equal(false);
            yield disconnect();
        }));
    it("should add a class of `disabled` when disabled is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.disabled = true;
            yield connect();
            expect(element.classList.contains("disabled")).to.equal(true);
            yield disconnect();
        }));
    it("should add a slot attribute of `item` to nested tree items", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const nestedItem = document.createElement("fast-tree-item");
            element.appendChild(nestedItem);
            yield connect();
            expect(nestedItem.getAttribute("slot")).to.equal("item");
            yield disconnect();
        }));
    it("should add a class of `nested` when nested is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.nested = true;
            yield connect();
            expect(element.classList.contains("nested")).to.equal(true);
            yield disconnect();
        }));
    it("should NOT set a tabindex when disabled is `true`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.disabled = true;
            yield connect();
            expect(element.hasAttribute("tabindex")).to.equal(false);
            expect(element.getAttribute("tabindex")).to.equal(null);
            yield disconnect();
        }));
    it("should set a tabindex when `focusable` is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.focusable = true;
            yield connect();
            expect(element.hasAttribute("tabindex")).to.equal(true);
            expect(element.getAttribute("tabindex")).to.equal("0");
            yield disconnect();
        }));
    it("should render an element with a class of `expand-collapse-button` when nested tree items exist", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { element, connect, disconnect } = yield setup();
            const nestedItem = document.createElement("fast-tree-item");
            element.appendChild(nestedItem);
            yield connect();
            yield DOM.nextUpdate();
            expect(
                (_a = element.shadowRoot) === null || _a === void 0
                    ? void 0
                    : _a.querySelector(".expand-collapse-button")
            ).to.exist;
            yield disconnect();
        }));
    it("should include an aria-hidden attribute on the `expand-collapse-button`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const { element, connect, disconnect } = yield setup();
            const nestedItem = document.createElement("fast-tree-item");
            element.appendChild(nestedItem);
            yield connect();
            yield DOM.nextUpdate();
            let button =
                (_b = element.shadowRoot) === null || _b === void 0
                    ? void 0
                    : _b.querySelector(".expand-collapse-button");
            expect(
                button === null || button === void 0
                    ? void 0
                    : button.getAttribute("aria-hidden")
            ).to.equal("true");
            yield disconnect();
        }));
    it("should render an element with a role of `group` when nested tree items exist and expanded is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            const { element, connect, disconnect } = yield setup();
            const nestedItem = document.createElement("fast-tree-item");
            element.appendChild(nestedItem);
            element.expanded = true;
            yield connect();
            yield DOM.nextUpdate();
            expect(
                (_d =
                    (_c = element.shadowRoot) === null || _c === void 0
                        ? void 0
                        : _c.querySelector(".items")) === null || _d === void 0
                    ? void 0
                    : _d.getAttribute("role")
            ).to.equal("group");
            yield disconnect();
        }));
    it("should NOT render an element with a role of `group` when nested tree items exist and expanded is false", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _e;
            const { element, connect, disconnect } = yield setup();
            const nestedItem = document.createElement("fast-tree-item");
            element.appendChild(nestedItem);
            yield connect();
            yield DOM.nextUpdate();
            expect(
                (_e = element.shadowRoot) === null || _e === void 0
                    ? void 0
                    : _e.querySelector(".items")
            ).not.to.exist;
            yield disconnect();
        }));
    describe("events", () => {
        it("should fire a change event when expanded changes", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const { element, connect, disconnect } = yield setup();
                const nestedItem = document.createElement("fast-tree-item");
                element.appendChild(nestedItem);
                let wasClicked = false;
                element.addEventListener("expanded-change", e => {
                    e.preventDefault();
                    wasClicked = true;
                });
                yield connect();
                yield DOM.nextUpdate();
                let button =
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector(".expand-collapse-button");
                button === null || button === void 0 ? void 0 : button.click();
                yield DOM.nextUpdate();
                expect(wasClicked).to.equal(true);
                yield disconnect();
            }));
        it("should toggle the expanded state when `expand-collapse-button` is clicked", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _b;
                const { element, connect, disconnect } = yield setup();
                const nestedItem = document.createElement("fast-tree-item");
                element.appendChild(nestedItem);
                yield connect();
                yield DOM.nextUpdate();
                let button =
                    (_b = element.shadowRoot) === null || _b === void 0
                        ? void 0
                        : _b.querySelector(".expand-collapse-button");
                button === null || button === void 0 ? void 0 : button.click();
                yield DOM.nextUpdate();
                expect(element.expanded).to.equal(true);
                expect(element.getAttribute("aria-expanded")).to.equal("true");
                button === null || button === void 0 ? void 0 : button.click();
                yield DOM.nextUpdate();
                expect(element.expanded).to.equal(false);
                expect(element.getAttribute("aria-expanded")).to.equal("false");
                yield disconnect();
            }));
        it("should fire a selected change event when selected changes", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                var _c;
                const { element, connect, disconnect } = yield setup();
                const nestedItem = document.createElement("fast-tree-item");
                element.appendChild(nestedItem);
                let wasClicked = false;
                element.addEventListener("selected-change", e => {
                    e.preventDefault();
                    wasClicked = true;
                });
                yield connect();
                yield DOM.nextUpdate();
                let container =
                    (_c = element.shadowRoot) === null || _c === void 0
                        ? void 0
                        : _c.querySelector(".positioning-region");
                container === null || container === void 0 ? void 0 : container.click();
                yield DOM.nextUpdate();
                expect(wasClicked).to.equal(true);
                yield disconnect();
            }));
        it("should toggle the selected state when the component is clicked", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                const nestedItem = document.createElement("fast-tree-item");
                element.appendChild(nestedItem);
                yield connect();
                yield DOM.nextUpdate();
                element.click();
                yield DOM.nextUpdate();
                expect(element.selected).to.equal(true);
                expect(element.getAttribute("aria-selected")).to.equal("true");
                element.click();
                yield DOM.nextUpdate();
                expect(element.selected).to.equal(false);
                expect(element.getAttribute("aria-selected")).to.equal("false");
                yield disconnect();
            }));
        it("should NOT toggle the selected state when the element is clicked when disabled", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                const nestedItem = document.createElement("fast-tree-item");
                element.appendChild(nestedItem);
                element.disabled = true;
                yield connect();
                yield DOM.nextUpdate();
                element.click();
                yield DOM.nextUpdate();
                expect(element.selected).to.not.equal(true);
                expect(element.getAttribute("aria-selected")).to.equal(null);
                yield disconnect();
            }));
    });
});
