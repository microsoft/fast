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
import { Menu, menuTemplate as template } from "./index";
import { MenuItem, menuItemTemplate as itemTemplate, MenuItemRole } from "../menu-item";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
import { KeyCodes } from "@microsoft/fast-web-utilities";
const FASTMenu = Menu.compose({
    baseName: "menu",
    template,
});
const FASTMenuItem = MenuItem.compose({
    baseName: "menu-item",
    template: itemTemplate,
});
const arrowUpEvent = new KeyboardEvent("keydown", {
    key: "ArrowUp",
    keyCode: KeyCodes.arrowUp,
    bubbles: true,
});
const arrowDownEvent = new KeyboardEvent("keydown", {
    key: "ArrowDown",
    keyCode: KeyCodes.arrowDown,
    bubbles: true,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture([
            FASTMenu(),
            FASTMenuItem(),
        ]);
        const menuItem1 = document.createElement("fast-menu-item");
        menuItem1.textContent = "Foo";
        menuItem1.id = "id1";
        const menuItem2 = document.createElement("fast-menu-item");
        menuItem2.textContent = "Bar";
        menuItem2.id = "id2";
        const menuItem3 = document.createElement("fast-menu-item");
        menuItem3.textContent = "Baz";
        menuItem3.id = "id3";
        const menuItem4 = document.createElement("fast-menu-item");
        menuItem4.textContent = "Bat";
        menuItem4.id = "id4";
        element.appendChild(menuItem1);
        element.appendChild(menuItem2);
        element.appendChild(menuItem3);
        element.appendChild(menuItem4);
        return {
            element,
            connect,
            disconnect,
            menuItem1,
            menuItem2,
            menuItem3,
            menuItem4,
        };
    });
}
describe("Menu", () => {
    it("should include a role of menu", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield fixture([
                FASTMenu(),
                FASTMenuItem(),
            ]);
            yield connect();
            expect(element.getAttribute("role")).to.equal("menu");
            yield disconnect();
        }));
    it("should focus on first menu item when focus is called", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            yield DOM.nextUpdate();
            element.focus();
            expect(
                (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.id
            ).to.equal("id1");
            yield disconnect();
        }));
    it("should not throw when focus is called with no items", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const { element, connect, disconnect } = yield fixture(FASTMenu());
            yield connect();
            yield DOM.nextUpdate();
            element.focus();
            expect(
                (_b = document.activeElement) === null || _b === void 0 ? void 0 : _b.id
            ).to.equal("");
            yield disconnect();
        }));
    it("should not throw when focus is called before initialization is complete", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            const { element, connect, disconnect } = yield setup();
            //don't wait for connect...
            element.focus();
            expect(
                (_c = document.activeElement) === null || _c === void 0 ? void 0 : _c.id
            ).to.equal("");
            yield disconnect();
        }));
    it("should set tabindex of the first focusable menu item to 0", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _d;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_d = document.getElementById("id1")) === null || _d === void 0
                    ? void 0
                    : _d.getAttribute("tabindex")
            ).to.equal("0");
            yield disconnect();
        }));
    it("should not set any tabindex on non menu items elements", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _e;
            const { element, connect, disconnect, menuItem1 } = yield setup();
            const notMenuItem = document.createElement("div");
            notMenuItem.id = "not-an-item";
            element.insertBefore(notMenuItem, menuItem1);
            yield connect();
            expect(
                (_e = document.getElementById("not-an-item")) === null || _e === void 0
                    ? void 0
                    : _e.hasAttribute("tabindex")
            ).to.equal(false);
            yield disconnect();
        }));
    it("should focus disabled items", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _f;
            const { element, connect, disconnect, menuItem1 } = yield setup();
            menuItem1.disabled = true;
            yield connect();
            expect(
                (_f = document.getElementById("id1")) === null || _f === void 0
                    ? void 0
                    : _f.getAttribute("tabindex")
            ).to.equal("0");
            yield disconnect();
        }));
    it("should accept elements with role of `menuitem` as focusable child", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _g;
            const { element, connect, disconnect } = yield setup();
            const menuItem1 = document.createElement("div");
            const menuItem2 = document.createElement("div");
            const menuItem3 = document.createElement("div");
            menuItem1.textContent = "Foo";
            menuItem1.role = "menuitem";
            menuItem2.textContent = "Bar";
            menuItem2.role = "menuitem";
            menuItem3.textContent = "Baz";
            menuItem3.role = "menuitem";
            element.appendChild(menuItem1);
            element.appendChild(menuItem2);
            element.appendChild(menuItem3);
            yield connect();
            expect(
                (_g = element.querySelector("[role='menuitem']")) === null ||
                    _g === void 0
                    ? void 0
                    : _g.getAttribute("tabindex")
            ).to.equal("0");
            yield disconnect();
        }));
    it("should accept elements with role of `menuitemcheckbox` as focusable child", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _h;
            const { element, connect, disconnect } = yield fixture(FASTMenu());
            const menuItem1 = document.createElement("div");
            const menuItem2 = document.createElement("div");
            const menuItem3 = document.createElement("div");
            menuItem1.textContent = "Foo";
            menuItem2.textContent = "Bar";
            menuItem3.textContent = "Baz";
            element.appendChild(menuItem1);
            element.appendChild(menuItem2);
            element.appendChild(menuItem3);
            menuItem1.setAttribute("role", "menuitemcheckbox");
            menuItem2.setAttribute("role", "menuitemcheckbox");
            menuItem3.setAttribute("role", "menuitemcheckbox");
            yield connect();
            yield DOM.nextUpdate();
            expect(
                (_h = element.querySelector("[role='menuitemcheckbox']")) === null ||
                    _h === void 0
                    ? void 0
                    : _h.getAttribute("tabindex")
            ).to.equal("0");
            yield disconnect();
        }));
    it("should accept elements with role of `menuitemradio` as focusable child", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _j;
            const { element, connect, disconnect } = yield fixture(FASTMenu());
            const menuItem1 = document.createElement("div");
            const menuItem2 = document.createElement("div");
            const menuItem3 = document.createElement("div");
            menuItem1.textContent = "Foo";
            menuItem2.textContent = "Bar";
            menuItem3.textContent = "Baz";
            element.appendChild(menuItem1);
            element.appendChild(menuItem2);
            element.appendChild(menuItem3);
            menuItem1.setAttribute("role", "menuitemradio");
            menuItem2.setAttribute("role", "menuitemradio");
            menuItem3.setAttribute("role", "menuitemradio");
            yield connect();
            yield DOM.nextUpdate();
            expect(
                (_j = element.querySelector("[role='menuitemradio']")) === null ||
                    _j === void 0
                    ? void 0
                    : _j.getAttribute("tabindex")
            ).to.equal("0");
            yield disconnect();
        }));
    it("should not set indent class on non-menu items", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _k;
            const {
                element,
                connect,
                disconnect,
                menuItem1,
                menuItem2,
                menuItem3,
            } = yield setup();
            const hr = document.createElement("hr");
            element.insertBefore(hr, menuItem2);
            hr.setAttribute("id", "hrid");
            yield connect();
            yield DOM.nextUpdate();
            expect(
                (_k = document.getElementById("hrid")) === null || _k === void 0
                    ? void 0
                    : _k.className
            ).to.not.contain("indent");
            yield disconnect();
        }));
    it("should set class on menu items to 0 columns", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const {
                element,
                connect,
                disconnect,
                menuItem1,
                menuItem2,
                menuItem3,
            } = yield setup();
            yield connect();
            yield DOM.nextUpdate();
            const item1 = element.querySelector('[id="id1"]');
            expect(
                item1 === null || item1 === void 0 ? void 0 : item1.className
            ).to.contain("indent-0");
            yield disconnect();
        }));
    it("should set class on menu items to 1 column", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const {
                element,
                connect,
                disconnect,
                menuItem1,
                menuItem2,
                menuItem3,
            } = yield setup();
            menuItem3.role = MenuItemRole.menuitemradio;
            yield connect();
            yield DOM.nextUpdate();
            const item1 = element.querySelector('[id="id1"]');
            expect(
                item1 === null || item1 === void 0 ? void 0 : item1.className
            ).to.contain("indent-1");
            yield disconnect();
        }));
    it("should set class on menu items to 2 columns", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const {
                element,
                connect,
                disconnect,
                menuItem1,
                menuItem2,
                menuItem3,
            } = yield setup();
            const startSlot = document.createElement("div");
            menuItem3.role = MenuItemRole.menuitemradio;
            startSlot.setAttribute("slot", "start");
            menuItem3.appendChild(startSlot);
            yield connect();
            yield DOM.nextUpdate();
            const item1 = element.querySelector('[id="id1"]');
            expect(
                item1 === null || item1 === void 0 ? void 0 : item1.className
            ).to.contain("indent-2");
            yield disconnect();
        }));
    it("should navigate the menu on arrow up/down keys", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
            const {
                element,
                connect,
                disconnect,
                menuItem1,
                menuItem2,
                menuItem3,
                menuItem4,
            } = yield setup();
            const notMenuItem1 = document.createElement("div");
            const notMenuItem2 = document.createElement("div");
            menuItem3.role = MenuItemRole.menuitemradio;
            menuItem4.role = MenuItemRole.menuitemcheckbox;
            element.insertBefore(notMenuItem1, menuItem3);
            element.insertBefore(notMenuItem2, menuItem4);
            yield connect();
            yield DOM.nextUpdate();
            const item1 = element.querySelector('[id="id1"]');
            item1.focus();
            expect(
                (_l = document.activeElement) === null || _l === void 0 ? void 0 : _l.id
            ).to.equal("id1");
            (_m = document.activeElement) === null || _m === void 0
                ? void 0
                : _m.dispatchEvent(arrowDownEvent);
            expect(
                (_o = document.activeElement) === null || _o === void 0 ? void 0 : _o.id
            ).to.equal("id2");
            (_p = document.activeElement) === null || _p === void 0
                ? void 0
                : _p.dispatchEvent(arrowDownEvent);
            expect(
                (_q = document.activeElement) === null || _q === void 0 ? void 0 : _q.id
            ).to.equal("id3");
            (_r = document.activeElement) === null || _r === void 0
                ? void 0
                : _r.dispatchEvent(arrowDownEvent);
            expect(
                (_s = document.activeElement) === null || _s === void 0 ? void 0 : _s.id
            ).to.equal("id4");
            (_t = document.activeElement) === null || _t === void 0
                ? void 0
                : _t.dispatchEvent(arrowDownEvent);
            expect(
                (_u = document.activeElement) === null || _u === void 0 ? void 0 : _u.id
            ).to.equal("id4");
            (_v = document.activeElement) === null || _v === void 0
                ? void 0
                : _v.dispatchEvent(arrowUpEvent);
            expect(
                (_w = document.activeElement) === null || _w === void 0 ? void 0 : _w.id
            ).to.equal("id3");
            (_x = document.activeElement) === null || _x === void 0
                ? void 0
                : _x.dispatchEvent(arrowUpEvent);
            expect(
                (_y = document.activeElement) === null || _y === void 0 ? void 0 : _y.id
            ).to.equal("id2");
            (_z = document.activeElement) === null || _z === void 0
                ? void 0
                : _z.dispatchEvent(arrowUpEvent);
            expect(
                (_0 = document.activeElement) === null || _0 === void 0 ? void 0 : _0.id
            ).to.equal("id1");
            (_1 = document.activeElement) === null || _1 === void 0
                ? void 0
                : _1.dispatchEvent(arrowUpEvent);
            expect(
                (_2 = document.activeElement) === null || _2 === void 0 ? void 0 : _2.id
            ).to.equal("id1");
            yield disconnect();
        }));
    it("should treat all checkbox menu items as individually selectable items", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const {
                element,
                connect,
                disconnect,
                menuItem1,
                menuItem2,
                menuItem3,
            } = yield setup();
            menuItem1.role = MenuItemRole.menuitemcheckbox;
            menuItem2.role = MenuItemRole.menuitemcheckbox;
            menuItem3.role = MenuItemRole.menuitemcheckbox;
            yield connect();
            yield DOM.nextUpdate();
            const item1 = element.querySelector('[id="id1"]');
            const item2 = element.querySelector('[id="id2"]');
            const item3 = element.querySelector('[id="id3"]');
            expect(
                item1 === null || item1 === void 0
                    ? void 0
                    : item1.getAttribute("aria-checked")
            ).to.equal(null);
            expect(
                item2 === null || item2 === void 0
                    ? void 0
                    : item2.getAttribute("aria-checked")
            ).to.equal(null);
            expect(
                item3 === null || item3 === void 0
                    ? void 0
                    : item3.getAttribute("aria-checked")
            ).to.equal(null);
            item1.click();
            yield DOM.nextUpdate();
            expect(
                item1 === null || item1 === void 0
                    ? void 0
                    : item1.getAttribute("aria-checked")
            ).to.equal("true");
            expect(
                item2 === null || item2 === void 0
                    ? void 0
                    : item2.getAttribute("aria-checked")
            ).to.equal(null);
            expect(
                item3 === null || item3 === void 0
                    ? void 0
                    : item3.getAttribute("aria-checked")
            ).to.equal(null);
            item2.click();
            yield DOM.nextUpdate();
            expect(
                item1 === null || item1 === void 0
                    ? void 0
                    : item1.getAttribute("aria-checked")
            ).to.equal("true");
            expect(
                item2 === null || item2 === void 0
                    ? void 0
                    : item2.getAttribute("aria-checked")
            ).to.equal("true");
            expect(
                item3 === null || item3 === void 0
                    ? void 0
                    : item3.getAttribute("aria-checked")
            ).to.equal(null);
            item3.click();
            yield DOM.nextUpdate();
            expect(
                item1 === null || item1 === void 0
                    ? void 0
                    : item1.getAttribute("aria-checked")
            ).to.equal("true");
            expect(
                item2 === null || item2 === void 0
                    ? void 0
                    : item2.getAttribute("aria-checked")
            ).to.equal("true");
            expect(
                item3 === null || item3 === void 0
                    ? void 0
                    : item3.getAttribute("aria-checked")
            ).to.equal("true");
            item3.click();
            yield DOM.nextUpdate();
            expect(
                item1 === null || item1 === void 0
                    ? void 0
                    : item1.getAttribute("aria-checked")
            ).to.equal("true");
            expect(
                item2 === null || item2 === void 0
                    ? void 0
                    : item2.getAttribute("aria-checked")
            ).to.equal("true");
            expect(
                item3 === null || item3 === void 0
                    ? void 0
                    : item3.getAttribute("aria-checked")
            ).to.equal("false");
            yield disconnect();
        }));
    it("should treat all radio menu items as a 'radio group' and limit selection to one item within the group by default", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const {
                element,
                connect,
                disconnect,
                menuItem1,
                menuItem2,
                menuItem3,
                menuItem4,
            } = yield setup();
            element.removeChild(menuItem4);
            menuItem1.role = MenuItemRole.menuitemradio;
            menuItem2.role = MenuItemRole.menuitemradio;
            menuItem3.role = MenuItemRole.menuitemradio;
            yield connect();
            yield DOM.nextUpdate();
            const item1 = element.querySelector('[id="id1"]');
            const item2 = element.querySelector('[id="id2"]');
            const item3 = element.querySelector('[id="id3"]');
            expect(
                item1 === null || item1 === void 0
                    ? void 0
                    : item1.getAttribute("aria-checked")
            ).to.equal(null);
            expect(
                item2 === null || item2 === void 0
                    ? void 0
                    : item2.getAttribute("aria-checked")
            ).to.equal(null);
            expect(
                item3 === null || item3 === void 0
                    ? void 0
                    : item3.getAttribute("aria-checked")
            ).to.equal(null);
            item1.click();
            yield DOM.nextUpdate();
            expect(
                item1 === null || item1 === void 0
                    ? void 0
                    : item1.getAttribute("aria-checked")
            ).to.equal("true");
            expect(
                item2 === null || item2 === void 0
                    ? void 0
                    : item2.getAttribute("aria-checked")
            ).to.equal("false");
            expect(
                item3 === null || item3 === void 0
                    ? void 0
                    : item3.getAttribute("aria-checked")
            ).to.equal("false");
            item2.click();
            yield DOM.nextUpdate();
            expect(
                item1 === null || item1 === void 0
                    ? void 0
                    : item1.getAttribute("aria-checked")
            ).to.equal("false");
            expect(
                item2 === null || item2 === void 0
                    ? void 0
                    : item2.getAttribute("aria-checked")
            ).to.equal("true");
            expect(
                item3 === null || item3 === void 0
                    ? void 0
                    : item3.getAttribute("aria-checked")
            ).to.equal("false");
            item3.click();
            yield DOM.nextUpdate();
            expect(
                item1 === null || item1 === void 0
                    ? void 0
                    : item1.getAttribute("aria-checked")
            ).to.equal("false");
            expect(
                item2 === null || item2 === void 0
                    ? void 0
                    : item2.getAttribute("aria-checked")
            ).to.equal("false");
            expect(
                item3 === null || item3 === void 0
                    ? void 0
                    : item3.getAttribute("aria-checked")
            ).to.equal("true");
            yield disconnect();
        }));
    it("should use elements with role='separator' to divide radio menu items into different radio groups ", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const {
                element,
                connect,
                disconnect,
                menuItem1,
                menuItem2,
                menuItem3,
                menuItem4,
            } = yield setup();
            menuItem1.role = MenuItemRole.menuitemradio;
            menuItem2.role = MenuItemRole.menuitemradio;
            menuItem3.role = MenuItemRole.menuitemradio;
            menuItem4.role = MenuItemRole.menuitemradio;
            const separator = document.createElement("div");
            element.insertBefore(separator, menuItem3);
            separator.setAttribute("role", "separator");
            yield connect();
            yield DOM.nextUpdate();
            const item1 = element.querySelector('[id="id1"]');
            const item2 = element.querySelector('[id="id2"]');
            const item3 = element.querySelector('[id="id3"]');
            const item4 = element.querySelector('[id="id4"]');
            expect(
                item1 === null || item1 === void 0
                    ? void 0
                    : item1.getAttribute("aria-checked")
            ).to.equal(null);
            expect(
                item2 === null || item2 === void 0
                    ? void 0
                    : item2.getAttribute("aria-checked")
            ).to.equal(null);
            expect(
                item3 === null || item3 === void 0
                    ? void 0
                    : item3.getAttribute("aria-checked")
            ).to.equal(null);
            expect(
                item4 === null || item4 === void 0
                    ? void 0
                    : item4.getAttribute("aria-checked")
            ).to.equal(null);
            item1.click();
            yield DOM.nextUpdate();
            expect(
                item1 === null || item1 === void 0
                    ? void 0
                    : item1.getAttribute("aria-checked")
            ).to.equal("true");
            expect(
                item2 === null || item2 === void 0
                    ? void 0
                    : item2.getAttribute("aria-checked")
            ).to.equal("false");
            expect(
                item3 === null || item3 === void 0
                    ? void 0
                    : item3.getAttribute("aria-checked")
            ).to.equal(null);
            expect(
                item4 === null || item4 === void 0
                    ? void 0
                    : item4.getAttribute("aria-checked")
            ).to.equal(null);
            item2.click();
            yield DOM.nextUpdate();
            expect(
                item1 === null || item1 === void 0
                    ? void 0
                    : item1.getAttribute("aria-checked")
            ).to.equal("false");
            expect(
                item2 === null || item2 === void 0
                    ? void 0
                    : item2.getAttribute("aria-checked")
            ).to.equal("true");
            expect(
                item3 === null || item3 === void 0
                    ? void 0
                    : item3.getAttribute("aria-checked")
            ).to.equal(null);
            expect(
                item4 === null || item4 === void 0
                    ? void 0
                    : item4.getAttribute("aria-checked")
            ).to.equal(null);
            item3.click();
            yield DOM.nextUpdate();
            expect(
                item1 === null || item1 === void 0
                    ? void 0
                    : item1.getAttribute("aria-checked")
            ).to.equal("false");
            expect(
                item2 === null || item2 === void 0
                    ? void 0
                    : item2.getAttribute("aria-checked")
            ).to.equal("true");
            expect(
                item3 === null || item3 === void 0
                    ? void 0
                    : item3.getAttribute("aria-checked")
            ).to.equal("true");
            expect(
                item4 === null || item4 === void 0
                    ? void 0
                    : item4.getAttribute("aria-checked")
            ).to.equal("false");
            yield disconnect();
        }));
});
