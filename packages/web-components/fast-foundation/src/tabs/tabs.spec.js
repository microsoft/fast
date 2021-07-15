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
import { css, DOM } from "@microsoft/fast-element";
import { fixture } from "../test-utilities/fixture";
import { Tab, tabTemplate } from "../tab";
import { TabPanel, tabPanelTemplate } from "../tab-panel";
import { TabsOrientation, Tabs, tabsTemplate as template } from "./index";
const FASTTab = Tab.compose({
    baseName: "tab",
    template: tabTemplate,
});
const FASTTabPanel = TabPanel.compose({
    baseName: "tab-panel",
    template: tabPanelTemplate,
});
const FASTTabs = Tabs.compose({
    baseName: "tabs",
    template,
    styles: css`
        .activeIndicatorTransition {
            transition: transform 1ms;
        }
    `,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture([
            FASTTabs(),
            FASTTabPanel(),
            FASTTab(),
        ]);
        for (let i = 1; i < 4; i++) {
            const tab = document.createElement("fast-tab");
            tab.id = `tab${i}`;
            const panel = document.createElement("fast-tab-panel");
            panel.id = `panel${i}`;
            element.appendChild(panel);
            element.insertBefore(tab, element.querySelector("fast-tab-panel"));
        }
        const [tabPanel1, tabPanel2, tabPanel3] = Array.from(
            element.querySelectorAll("fast-tab-panel")
        );
        const [tab1, tab2, tab3] = Array.from(element.querySelectorAll("fast-tab"));
        return {
            element,
            connect,
            disconnect,
            tab1,
            tab2,
            tab3,
            tabPanel1,
            tabPanel2,
            tabPanel3,
        };
    });
}
// TODO: Need to add tests for keyboard handling, activeIndicator position, and focus management
describe("Tabs", () => {
    it("should have an internal element with a role of `tablist`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_b =
                    (_a = element.shadowRoot) === null || _a === void 0
                        ? void 0
                        : _a.querySelector(".tablist")) === null || _b === void 0
                    ? void 0
                    : _b.getAttribute("role")
            ).to.equal("tablist");
            yield disconnect();
        }));
    it("should set a default value of `orientation` when orientation is not provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.orientation).to.equal(TabsOrientation.horizontal);
            yield disconnect();
        }));
    it("should add a class equal to the `orientation` value", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.orientation = TabsOrientation.horizontal;
            yield connect();
            expect(element.classList.contains(TabsOrientation.horizontal)).to.equal(true);
            element.orientation = TabsOrientation.vertical;
            yield DOM.nextUpdate();
            expect(element.classList.contains(TabsOrientation.vertical)).to.equal(true);
            yield disconnect();
        }));
    it("should set a property equal to activeIndicator when `activeIndicator` property is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.setAttribute("activeIndicator", "false");
            yield connect();
            expect(element.activeindicator).to.equal(false);
            yield disconnect();
        }));
    it("should render an internal element with a class of 'activeIndicator' when `activeIndicator` is true", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_c = element.shadowRoot) === null || _c === void 0
                    ? void 0
                    : _c.querySelector(".activeIndicator")
            ).to.exist;
            yield disconnect();
        }));
    it("should set an `id` attribute on the active tab when an `id` is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _d, _e;
            const { element, connect, disconnect, tab1, tab2, tab3 } = yield setup();
            tab1.id = "01";
            tab2.id = "02";
            tab3.id = "03";
            yield connect();
            expect(
                (_d = element.querySelector("fast-tab")) === null || _d === void 0
                    ? void 0
                    : _d.getAttribute("id")
            ).to.equal("01");
            expect(
                (_e = element.querySelectorAll("fast-tab")[1]) === null || _e === void 0
                    ? void 0
                    : _e.getAttribute("id")
            ).to.equal("02");
            yield disconnect();
        }));
    it("should set an `id` attribute tab items relative to the index if an `id is NOT provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _f, _g;
            const { element, connect, disconnect } = yield fixture([
                FASTTabs(),
                FASTTabPanel(),
                FASTTab(),
            ]);
            for (let i = 1; i < 4; i++) {
                const tab = document.createElement("fast-tab");
                const panel = document.createElement("fast-tab-panel");
                element.appendChild(panel);
                element.insertBefore(tab, element.querySelector("fast-tab-panel"));
            }
            yield connect();
            expect(
                (_f = element.querySelector("fast-tab")) === null || _f === void 0
                    ? void 0
                    : _f.getAttribute("id")
            ).to.equal("tab-1");
            expect(
                (_g = element.querySelectorAll("fast-tab")[1]) === null || _g === void 0
                    ? void 0
                    : _g.getAttribute("id")
            ).to.equal("tab-2");
            yield disconnect();
        }));
    it("should set an `id` attribute on the tabpanel when an `id is provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _h, _j;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_h = element.querySelector("fast-tab-panel")) === null || _h === void 0
                    ? void 0
                    : _h.getAttribute("id")
            ).to.equal("panel1");
            expect(
                (_j = element.querySelectorAll("fast-tab-panel")[1]) === null ||
                    _j === void 0
                    ? void 0
                    : _j.getAttribute("id")
            ).to.equal("panel2");
            yield disconnect();
        }));
    it("should set an `id` attribute on tabpanel items relative to the index if an `id is NOT provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _k, _l;
            const { element, connect, disconnect } = yield fixture([
                FASTTabs(),
                FASTTabPanel(),
                FASTTab(),
            ]);
            for (let i = 1; i < 4; i++) {
                const tab = document.createElement("fast-tab");
                const panel = document.createElement("fast-tab-panel");
                element.appendChild(panel);
                element.insertBefore(tab, element.querySelector("fast-tab-panel"));
            }
            yield connect();
            expect(
                (_k = element.querySelector("fast-tab-panel")) === null || _k === void 0
                    ? void 0
                    : _k.getAttribute("id")
            ).to.equal("panel-1");
            expect(
                (_l = element.querySelectorAll("fast-tab-panel")[1]) === null ||
                    _l === void 0
                    ? void 0
                    : _l.getAttribute("id")
            ).to.equal("panel-2");
            yield disconnect();
        }));
    describe("active tab", () => {
        it("should set an `aria-selected` attribute on the active tab when `activeId` is provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, tab2 } = yield setup();
                yield connect();
                element.activeid = "tab2";
                expect(tab2.getAttribute("aria-selected")).to.equal("true");
                yield disconnect();
            }));
        it("should default the first tab as the active index if `activeId` is NOT provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, tab1 } = yield setup();
                yield connect();
                expect(tab1.getAttribute("aria-selected")).to.equal("true");
                yield disconnect();
            }));
        it("should set an `aria-selected` attribute on the active tab when `activeId` is provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, tab2 } = yield setup();
                element.activeid = "tab2";
                yield connect();
                expect(tab2.getAttribute("aria-selected")).to.equal("true");
                yield disconnect();
            }));
        it("should update `aria-selected` attribute on the active tab when `activeId` is updated", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, tab2, tab3 } = yield setup();
                element.setAttribute("activeId", "tab2");
                yield connect();
                expect(tab2.getAttribute("aria-selected")).to.equal("true");
                element.setAttribute("activeId", "tab3");
                expect(tab3.getAttribute("aria-selected")).to.equal("true");
                yield disconnect();
            }));
        it("should skip updating the active indicator if click twice on the same tab", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, tab2 } = yield setup();
                yield connect();
                const activeIndicator = element.shadowRoot.querySelector(
                    '[part="activeIndicator"]'
                );
                yield new Promise(resolve => {
                    activeIndicator.addEventListener("transitionend", resolve, {
                        once: true,
                    });
                    tab2.click();
                    expect(
                        activeIndicator.classList.contains("activeIndicatorTransition")
                    ).to.be.true;
                });
                yield DOM.nextUpdate();
                tab2.click();
                expect(
                    activeIndicator.classList.contains("activeIndicatorTransition")
                ).to.be.false;
                yield disconnect();
            }));
    });
    describe("active tabpanel", () => {
        it("should set an `aria-labelledby` attribute on the tabpanel with a value of the tab id when `activeid` is provided", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, tabPanel2 } = yield setup();
                yield connect();
                element.activeid = "tab2";
                expect(tabPanel2.getAttribute("aria-labelledby")).to.equal("tab2");
                yield disconnect();
            }));
        it("should set an attribute of hidden if the tabpanel is not active", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const {
                    element,
                    connect,
                    disconnect,
                    tabPanel1,
                    tabPanel3,
                } = yield setup();
                yield connect();
                element.activeid = "tab2";
                expect(tabPanel1.hasAttribute("hidden")).to.equal(true);
                expect(tabPanel3.hasAttribute("hidden")).to.equal(true);
                yield disconnect();
            }));
        it("should NOT set an attribute of hidden if the tabpanel is active", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, tabPanel2 } = yield setup();
                yield connect();
                element.activeid = "tab2";
                expect(tabPanel2.hasAttribute("hidden")).to.equal(false);
                yield disconnect();
            }));
    });
    describe("disabled tab", () => {
        it("should not display an active indicator if all tabs are disabled", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield fixture([
                    FASTTabs(),
                    FASTTabPanel(),
                    FASTTab(),
                ]);
                for (let i = 1; i < 4; i++) {
                    const tab = document.createElement("fast-tab");
                    tab.disabled = true;
                    const panel = document.createElement("fast-tab-panel");
                    panel.id = `panel${i}`;
                    element.appendChild(panel);
                    element.insertBefore(tab, element.querySelector("fast-tab-panel"));
                }
                yield connect();
                expect(element.showActiveIndicator).to.be.false;
                yield disconnect();
            }));
        it("should display an active indicator if the last tab is disabled", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield fixture([
                    FASTTabs(),
                    FASTTabPanel(),
                    FASTTab(),
                ]);
                for (let i = 1; i < 4; i++) {
                    const tab = document.createElement("fast-tab");
                    tab.id = `tab${i}`;
                    if (i === 3) {
                        tab.disabled = true;
                    }
                    const panel = document.createElement("fast-tab-panel");
                    panel.id = `panel${i}`;
                    element.appendChild(panel);
                    element.insertBefore(tab, element.querySelector("fast-tab-panel"));
                }
                yield connect();
                expect(element.showActiveIndicator).to.be.true;
                yield disconnect();
            }));
    });
});
