var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { attr, observable } from "@microsoft/fast-element";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeHome,
    wrapInBounds,
} from "@microsoft/fast-web-utilities";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { FoundationElement } from "../foundation-element";
/**
 * The orientation of the {@link @microsoft/fast-foundation#(Tabs:class)} component
 * @public
 */
export var TabsOrientation;
(function (TabsOrientation) {
    TabsOrientation["vertical"] = "vertical";
    TabsOrientation["horizontal"] = "horizontal";
})(TabsOrientation || (TabsOrientation = {}));
/**
 * A Tabs Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#tablist | ARIA tablist }.
 *
 * @public
 */
export class Tabs extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * The orientation
         * @public
         * @remarks
         * HTML Attribute: orientation
         */
        this.orientation = TabsOrientation.horizontal;
        /**
         * Whether or not to show the active indicator
         * @public
         * @remarks
         * HTML Attribute: activeindicator
         */
        this.activeindicator = true;
        /**
         * @internal
         */
        this.showActiveIndicator = true;
        this.prevActiveTabIndex = 0;
        this.activeTabIndex = 0;
        this.ticking = false;
        this.change = () => {
            this.$emit("change", this.activetab);
        };
        this.isDisabledElement = el => {
            return el.getAttribute("aria-disabled") === "true";
        };
        this.isFocusableElement = el => {
            return !this.isDisabledElement(el);
        };
        this.setTabs = () => {
            const gridProperty = this.isHorizontal() ? "gridColumn" : "gridRow";
            this.tabIds = this.getTabIds();
            this.tabpanelIds = this.getTabPanelIds();
            this.activeTabIndex = this.getActiveIndex();
            this.showActiveIndicator = false;
            this.tabs.forEach((tab, index) => {
                if (tab.slot === "tab" && this.isFocusableElement(tab)) {
                    if (this.activeindicator) {
                        this.showActiveIndicator = true;
                    }
                    const tabId = this.tabIds[index];
                    const tabpanelId = this.tabpanelIds[index];
                    tab.setAttribute(
                        "id",
                        typeof tabId !== "string" ? `tab-${index + 1}` : tabId
                    );
                    tab.setAttribute(
                        "aria-selected",
                        this.activeTabIndex === index ? "true" : "false"
                    );
                    tab.setAttribute(
                        "aria-controls",
                        typeof tabpanelId !== "string" ? `panel-${index + 1}` : tabpanelId
                    );
                    tab.addEventListener("click", this.handleTabClick);
                    tab.addEventListener("keydown", this.handleTabKeyDown);
                    tab.setAttribute(
                        "tabindex",
                        this.activeTabIndex === index ? "0" : "-1"
                    );
                    if (this.activeTabIndex === index) {
                        this.activetab = tab;
                    }
                }
                tab.style[gridProperty] = `${index + 1}`;
                !this.isHorizontal()
                    ? tab.classList.add("vertical")
                    : tab.classList.remove("vertical");
            });
        };
        this.setTabPanels = () => {
            this.tabIds = this.getTabIds();
            this.tabpanelIds = this.getTabPanelIds();
            this.tabpanels.forEach((tabpanel, index) => {
                const tabId = this.tabIds[index];
                const tabpanelId = this.tabpanelIds[index];
                tabpanel.setAttribute(
                    "id",
                    typeof tabpanelId !== "string" ? `panel-${index + 1}` : tabpanelId
                );
                tabpanel.setAttribute(
                    "aria-labelledby",
                    typeof tabId !== "string" ? `tab-${index + 1}` : tabId
                );
                this.activeTabIndex !== index
                    ? tabpanel.setAttribute("hidden", "")
                    : tabpanel.removeAttribute("hidden");
            });
        };
        this.handleTabClick = event => {
            const selectedTab = event.currentTarget;
            if (selectedTab.nodeType === 1) {
                this.prevActiveTabIndex = this.activeTabIndex;
                this.activeTabIndex = this.tabs.indexOf(selectedTab);
                this.setComponent();
            }
        };
        this.handleTabKeyDown = event => {
            const keyCode = event.keyCode;
            if (this.isHorizontal()) {
                switch (keyCode) {
                    case keyCodeArrowLeft:
                        event.preventDefault();
                        this.adjustBackward(event);
                        break;
                    case keyCodeArrowRight:
                        event.preventDefault();
                        this.adjustForward(event);
                        break;
                }
            } else {
                switch (keyCode) {
                    case keyCodeArrowUp:
                        event.preventDefault();
                        this.adjustBackward(event);
                        break;
                    case keyCodeArrowDown:
                        event.preventDefault();
                        this.adjustForward(event);
                        break;
                }
            }
            switch (keyCode) {
                case keyCodeHome:
                    event.preventDefault();
                    this.adjust(-this.activeTabIndex);
                    break;
                case keyCodeEnd:
                    event.preventDefault();
                    this.adjust(this.tabs.length - this.activeTabIndex - 1);
                    break;
            }
        };
        this.adjustForward = e => {
            const group = this.tabs;
            let index = 0;
            index = this.activetab ? group.indexOf(this.activetab) + 1 : 1;
            if (index === group.length) {
                index = 0;
            }
            while (index < group.length && group.length > 1) {
                if (this.isFocusableElement(group[index])) {
                    this.moveToTabByIndex(group, index);
                    break;
                } else if (this.activetab && index === group.indexOf(this.activetab)) {
                    break;
                } else if (index + 1 >= group.length) {
                    index = 0;
                } else {
                    index += 1;
                }
            }
        };
        this.adjustBackward = e => {
            const group = this.tabs;
            let index = 0;
            index = this.activetab ? group.indexOf(this.activetab) - 1 : 0;
            index = index < 0 ? group.length - 1 : index;
            while (index >= 0 && group.length > 1) {
                if (this.isFocusableElement(group[index])) {
                    this.moveToTabByIndex(group, index);
                    break;
                } else if (index - 1 < 0) {
                    index = group.length - 1;
                } else {
                    index -= 1;
                }
            }
        };
        this.moveToTabByIndex = (group, index) => {
            const tab = group[index];
            this.activetab = tab;
            this.prevActiveTabIndex = this.activeTabIndex;
            this.activeTabIndex = index;
            tab.focus();
            this.setComponent();
        };
    }
    /**
     * @internal
     */
    activeidChanged() {
        if (
            this.$fastController.isConnected &&
            this.tabs.length <= this.tabpanels.length
        ) {
            this.setTabs();
            this.setTabPanels();
            this.handleActiveIndicatorPosition();
        }
    }
    /**
     * @internal
     */
    tabsChanged() {
        if (
            this.$fastController.isConnected &&
            this.tabs.length <= this.tabpanels.length
        ) {
            this.setTabs();
            this.setTabPanels();
            this.handleActiveIndicatorPosition();
        }
    }
    /**
     * @internal
     */
    tabpanelsChanged() {
        if (
            this.$fastController.isConnected &&
            this.tabpanels.length <= this.tabs.length
        ) {
            this.setTabs();
            this.setTabPanels();
            this.handleActiveIndicatorPosition();
        }
    }
    getActiveIndex() {
        const id = this.activeid;
        if (id !== undefined) {
            return this.tabIds.indexOf(this.activeid) === -1
                ? 0
                : this.tabIds.indexOf(this.activeid);
        } else {
            return 0;
        }
    }
    getTabIds() {
        return this.tabs.map(tab => {
            return tab.getAttribute("id");
        });
    }
    getTabPanelIds() {
        return this.tabpanels.map(tabPanel => {
            return tabPanel.getAttribute("id");
        });
    }
    setComponent() {
        if (this.activeTabIndex !== this.prevActiveTabIndex) {
            this.activeid = this.tabIds[this.activeTabIndex];
            this.change();
            this.setTabs();
            this.handleActiveIndicatorPosition();
            this.setTabPanels();
            this.focusTab();
            this.change();
        }
    }
    isHorizontal() {
        return this.orientation === TabsOrientation.horizontal;
    }
    handleActiveIndicatorPosition() {
        // Ignore if we click twice on the same tab
        if (
            this.showActiveIndicator &&
            this.activeindicator &&
            this.activeTabIndex !== this.prevActiveTabIndex
        ) {
            if (this.ticking) {
                this.ticking = false;
            } else {
                this.ticking = true;
                this.animateActiveIndicator();
            }
        }
    }
    animateActiveIndicator() {
        this.ticking = true;
        const gridProperty = this.isHorizontal() ? "gridColumn" : "gridRow";
        const translateProperty = this.isHorizontal() ? "translateX" : "translateY";
        const offsetProperty = this.isHorizontal() ? "offsetLeft" : "offsetTop";
        const prev = this.activeIndicatorRef[offsetProperty];
        this.activeIndicatorRef.style[gridProperty] = `${this.activeTabIndex + 1}`;
        const next = this.activeIndicatorRef[offsetProperty];
        this.activeIndicatorRef.style[gridProperty] = `${this.prevActiveTabIndex + 1}`;
        const dif = next - prev;
        this.activeIndicatorRef.style.transform = `${translateProperty}(${dif}px)`;
        this.activeIndicatorRef.classList.add("activeIndicatorTransition");
        this.activeIndicatorRef.addEventListener("transitionend", () => {
            this.ticking = false;
            this.activeIndicatorRef.style[gridProperty] = `${this.activeTabIndex + 1}`;
            this.activeIndicatorRef.style.transform = `${translateProperty}(0px)`;
            this.activeIndicatorRef.classList.remove("activeIndicatorTransition");
        });
    }
    /**
     * The adjust method for FASTTabs
     * @public
     * @remarks
     * This method allows the active index to be adjusted by numerical increments
     */
    adjust(adjustment) {
        this.prevActiveTabIndex = this.activeTabIndex;
        this.activeTabIndex = wrapInBounds(
            0,
            this.tabs.length - 1,
            this.activeTabIndex + adjustment
        );
        this.setComponent();
    }
    focusTab() {
        this.tabs[this.activeTabIndex].focus();
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.tabIds = this.getTabIds();
        this.tabpanelIds = this.getTabPanelIds();
        this.activeTabIndex = this.getActiveIndex();
    }
}
__decorate([attr], Tabs.prototype, "orientation", void 0);
__decorate([attr], Tabs.prototype, "activeid", void 0);
__decorate([observable], Tabs.prototype, "tabs", void 0);
__decorate([observable], Tabs.prototype, "tabpanels", void 0);
__decorate([attr({ mode: "boolean" })], Tabs.prototype, "activeindicator", void 0);
__decorate([observable], Tabs.prototype, "activeIndicatorRef", void 0);
__decorate([observable], Tabs.prototype, "showActiveIndicator", void 0);
applyMixins(Tabs, StartEnd);
