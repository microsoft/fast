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
import { MenuItem, menuItemTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
import { MenuItemRole } from "./menu-item";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { AnchoredRegion, anchoredRegionTemplate } from "../anchored-region";
const FASTMenuItem = MenuItem.compose({
    baseName: "menu-item",
    template,
});
const FASTAnchoredRegion = AnchoredRegion.compose({
    baseName: "anchored-region",
    template: anchoredRegionTemplate,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture([
            FASTMenuItem(),
            FASTAnchoredRegion(),
        ]);
        return { element, connect, disconnect };
    });
}
// TODO: Add tests for keyboard handling
describe("Menu item", () => {
    it("should include a role of menuitem when `menuitem` role is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const role = MenuItemRole.menuitem;
            element.role = role;
            yield connect();
            expect(element.getAttribute("role")).to.equal(role);
            yield disconnect();
        }));
    it("should include a role of `menuitemcheckbox` when `menuitemcheckbox` role is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const role = MenuItemRole.menuitemcheckbox;
            element.role = role;
            yield connect();
            expect(element.getAttribute("role")).to.equal(role);
            yield disconnect();
        }));
    it("should include a role of `menuitemradio` when `menuitemradio` role is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const role = MenuItemRole.menuitemradio;
            element.role = role;
            yield connect();
            expect(element.getAttribute("role")).to.equal(role);
            yield disconnect();
        }));
    it("should include a role of `menuitem` by default when no role is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("role")).to.equal(MenuItemRole.menuitem);
            yield disconnect();
        }));
    it("should set the `aria-disabled` attribute with the `disabled` value when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.disabled = true;
            yield connect();
            expect(element.getAttribute("aria-disabled")).to.equal("true");
            yield disconnect();
        }));
    it("should set an `aria-expanded` attribute with the `expanded` value when provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.expanded = true;
            yield connect();
            expect(element.getAttribute("aria-expanded")).to.equal("true");
            yield disconnect();
        }));
    it("should set an `aria-checked` attribute with the `checked` value when provided to a menuitemcheckbox", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.role = MenuItemRole.menuitemcheckbox;
            element.checked = true;
            yield connect();
            expect(element.getAttribute("aria-checked")).to.equal("true");
            yield disconnect();
        }));
    it("should NOT set an `aria-checked` attribute when checked is provided to a menuitem", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.role = MenuItemRole.menuitem;
            element.checked = true;
            yield connect();
            expect(element.getAttribute("aria-checked")).to.equal(null);
            yield disconnect();
        }));
    it("should toggle the aria-checked attribute of checkbox item when clicked", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.role = MenuItemRole.menuitemcheckbox;
            yield connect();
            yield DOM.nextUpdate();
            expect(element.getAttribute("aria-checked")).to.equal(null);
            element.click();
            yield DOM.nextUpdate();
            expect(element.getAttribute("aria-checked")).to.equal("true");
            element.click();
            yield DOM.nextUpdate();
            expect(element.getAttribute("aria-checked")).to.equal("false");
            yield disconnect();
        }));
    it("should aria-checked attribute of radio item to true when clicked", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.role = MenuItemRole.menuitemradio;
            yield connect();
            yield DOM.nextUpdate();
            expect(element.getAttribute("aria-checked")).to.equal(null);
            element.click();
            yield DOM.nextUpdate();
            expect(element.getAttribute("aria-checked")).to.equal("true");
            element.click();
            yield DOM.nextUpdate();
            expect(element.getAttribute("aria-checked")).to.equal("true");
            yield disconnect();
        }));
    describe("events", () => {
        it("should fire an event on click", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                let wasClicked = false;
                yield connect();
                element.addEventListener("change", e => {
                    e.preventDefault();
                    wasClicked = true;
                });
                yield DOM.nextUpdate();
                element.click();
                expect(wasClicked).to.equal(true);
                yield disconnect();
            }));
        it("should fire an event when spacebar is invoked", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                let wasInvoked = false;
                const event = new KeyboardEvent("keydown", {
                    key: "space",
                    keyCode: KeyCodes.space,
                });
                yield connect();
                element.addEventListener("keydown", e => {
                    e.preventDefault();
                    wasInvoked = true;
                });
                yield DOM.nextUpdate();
                element.dispatchEvent(event);
                expect(wasInvoked).to.equal(true);
                yield disconnect();
            }));
        it("should fire an event when enter is invoked", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup();
                let wasInvoked = false;
                const event = new KeyboardEvent("keydown", {
                    key: "enter",
                    keyCode: KeyCodes.enter,
                });
                yield connect();
                element.addEventListener("keydown", e => {
                    e.preventDefault();
                    wasInvoked = true;
                });
                yield DOM.nextUpdate();
                element.dispatchEvent(event);
                expect(wasInvoked).to.equal(true);
                yield disconnect();
            }));
    });
});
