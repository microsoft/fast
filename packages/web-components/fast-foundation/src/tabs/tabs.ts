import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp,
    keyEnd,
    keyHome,
    limit,
    uniqueId,
} from "@microsoft/fast-web-utilities";
import { StartEnd } from "../patterns/start-end.js";
import type { StartEndOptions } from "../patterns/start-end.js";
import { applyMixins } from "../utilities/apply-mixins.js";

/**
 * Tabs option configuration options
 * @public
 */
export type TabsOptions = StartEndOptions;

/**
 * The orientation of the {@link @microsoft/fast-foundation#(FASTTabs:class)} component
 * @public
 */
export const TabsOrientation = {
    vertical: "vertical",
    horizontal: "horizontal",
} as const;

/**
 * The types for the Tabs component
 * @public
 */
export type TabsOrientation = typeof TabsOrientation[keyof typeof TabsOrientation];

/**
 * A Tabs Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#tablist | ARIA tablist }.
 *
 * @slot start - Content which can be provided before the tablist element
 * @slot end - Content which can be provided after the tablist element
 * @slot tab - The slot for tabs
 * @slot tabpanel - The slot for tabpanels
 * @csspart tablist - The element wrapping the tabs
 * @csspart tabpanel - The element wrapping the tabpanels
 * @csspart active-indicator - The visual indicator
 * @fires change - Fires a custom 'change' event when a tab is clicked or during keyboard navigation
 *
 * @public
 */
export class FASTTabs extends FASTElement {
    /**
     * The orientation
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    @attr
    public orientation: TabsOrientation = TabsOrientation.horizontal;
    /**
     * @internal
     */
    public orientationChanged(): void {
        if (this.$fastController.isConnected) {
            this.setTabs();
            this.setTabPanels();
            this.handleActiveIndicatorPosition();
        }
    }
    /**
     * The id of the active tab
     *
     * @public
     * @remarks
     * HTML Attribute: activeid
     */
    @attr
    public activeid: string;
    /**
     * @internal
     */
    public activeidChanged(oldValue: string, newValue: string): void {
        if (
            this.$fastController.isConnected &&
            this.tabs.length <= this.tabpanels.length
        ) {
            this.prevActiveTabIndex = this.tabs.findIndex(
                (item: HTMLElement) => item.id === oldValue
            );
            this.setTabs();
            this.setTabPanels();
            this.handleActiveIndicatorPosition();
        }
    }

    /**
     * @internal
     */
    @observable
    public tabs: HTMLElement[];
    /**
     * @internal
     */
    public tabsChanged(): void {
        if (
            this.$fastController.isConnected &&
            this.tabs.length <= this.tabpanels.length
        ) {
            this.tabIds = this.getTabIds();
            this.tabpanelIds = this.getTabPanelIds();

            this.setTabs();
            this.setTabPanels();
            this.handleActiveIndicatorPosition();
        }
    }

    /**
     * @internal
     */
    @observable
    public tabpanels: HTMLElement[];
    /**
     * @internal
     */
    public tabpanelsChanged(): void {
        if (
            this.$fastController.isConnected &&
            this.tabpanels.length <= this.tabs.length
        ) {
            this.tabIds = this.getTabIds();
            this.tabpanelIds = this.getTabPanelIds();

            this.setTabs();
            this.setTabPanels();
            this.handleActiveIndicatorPosition();
        }
    }

    /**
     * Whether or not to show the active indicator
     * @public
     * @remarks
     * HTML Attribute: activeindicator
     */
    @attr({ attribute: "hide-active-indicator", mode: "boolean" })
    public hideActiveIndicator = false;

    /**
     * @internal
     */
    @observable
    public activeIndicator: HTMLElement;

    /**
     * @internal
     */
    @observable
    public showActiveIndicator: boolean = true;

    /**
     * A reference to the active tab
     * @public
     */
    public activetab: HTMLElement;

    private prevActiveTabIndex: number = 0;
    private activeTabIndex: number = 0;
    private ticking: boolean = false;
    private tabIds: Array<string>;
    private tabpanelIds: Array<string>;

    private change = (): void => {
        this.$emit("change", this.activetab);
    };

    private isDisabledElement = (el: Element): el is HTMLElement => {
        return el.getAttribute("aria-disabled") === "true";
    };

    private isFocusableElement = (el: Element): el is HTMLElement => {
        return !this.isDisabledElement(el);
    };

    private getActiveIndex(): number {
        const id: string = this.activeid;
        if (id !== undefined) {
            return this.tabIds.indexOf(this.activeid) === -1
                ? 0
                : this.tabIds.indexOf(this.activeid);
        } else {
            return 0;
        }
    }

    private setTabs = (): void => {
        const gridHorizontalProperty: string = "gridColumn";
        const gridVerticalProperty: string = "gridRow";
        const gridProperty: string = this.isHorizontal()
            ? gridHorizontalProperty
            : gridVerticalProperty;

        this.activeTabIndex = this.getActiveIndex();
        this.showActiveIndicator = false;
        this.tabs.forEach((tab: HTMLElement, index: number) => {
            if (tab.slot === "tab") {
                const isActiveTab =
                    this.activeTabIndex === index && this.isFocusableElement(tab);
                if (!this.hideActiveIndicator && this.isFocusableElement(tab)) {
                    this.showActiveIndicator = true;
                }
                const tabId: string = this.tabIds[index];
                const tabpanelId: string = this.tabpanelIds[index];
                tab.setAttribute("id", tabId);
                tab.setAttribute("aria-selected", isActiveTab ? "true" : "false");
                tab.setAttribute("aria-controls", tabpanelId);
                tab.addEventListener("click", this.handleTabClick);
                tab.addEventListener("keydown", this.handleTabKeyDown);
                tab.setAttribute("tabindex", isActiveTab ? "0" : "-1");
                if (isActiveTab) {
                    this.activetab = tab;
                }
            }

            // If the original property isn't emptied out,
            // the next set will morph into a grid-area style setting that is not what we want
            tab.style[gridHorizontalProperty] = "";
            tab.style[gridVerticalProperty] = "";
            tab.style[gridProperty] = `${index + 1}`;
            !this.isHorizontal()
                ? tab.classList.add("vertical")
                : tab.classList.remove("vertical");
        });
    };

    private setTabPanels = (): void => {
        this.tabpanels.forEach((tabpanel: HTMLElement, index: number) => {
            const tabId: string = this.tabIds[index];
            const tabpanelId: string = this.tabpanelIds[index];
            tabpanel.setAttribute("id", tabpanelId);
            tabpanel.setAttribute("aria-labelledby", tabId);
            this.activeTabIndex !== index
                ? tabpanel.setAttribute("hidden", "")
                : tabpanel.removeAttribute("hidden");
        });
    };

    private getTabIds(): Array<string> {
        return this.tabs.map((tab: HTMLElement) => {
            return tab.getAttribute("id") ?? `tab-${uniqueId()}`;
        });
    }

    private getTabPanelIds(): Array<string> {
        return this.tabpanels.map((tabPanel: HTMLElement) => {
            return tabPanel.getAttribute("id") ?? `panel-${uniqueId()}`;
        });
    }

    private setComponent(): void {
        if (this.activeTabIndex !== this.prevActiveTabIndex) {
            this.activeid = this.tabIds[this.activeTabIndex] as string;
            this.focusTab();
            this.change();
        }
    }

    private handleTabClick = (event: MouseEvent): void => {
        const selectedTab = event.currentTarget as HTMLElement;
        if (selectedTab.nodeType === 1 && this.isFocusableElement(selectedTab)) {
            this.prevActiveTabIndex = this.activeTabIndex;
            this.activeTabIndex = this.tabs.indexOf(selectedTab);
            this.setComponent();
        }
    };

    private isHorizontal(): boolean {
        return this.orientation === TabsOrientation.horizontal;
    }

    private handleTabKeyDown = (event: KeyboardEvent): void => {
        if (this.isHorizontal()) {
            switch (event.key) {
                case keyArrowLeft:
                    event.preventDefault();
                    this.adjustBackward(event);
                    break;
                case keyArrowRight:
                    event.preventDefault();
                    this.adjustForward(event);
                    break;
            }
        } else {
            switch (event.key) {
                case keyArrowUp:
                    event.preventDefault();
                    this.adjustBackward(event);
                    break;
                case keyArrowDown:
                    event.preventDefault();
                    this.adjustForward(event);
                    break;
            }
        }
        switch (event.key) {
            case keyHome:
                event.preventDefault();
                this.adjust(-this.activeTabIndex);
                break;
            case keyEnd:
                event.preventDefault();
                this.adjust(this.tabs.length - this.activeTabIndex - 1);
                break;
        }
    };

    private handleActiveIndicatorPosition() {
        // Ignore if we click twice on the same tab
        if (
            this.showActiveIndicator &&
            !this.hideActiveIndicator &&
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

    private animateActiveIndicator(): void {
        this.ticking = true;
        const gridProperty: string = this.isHorizontal() ? "gridColumn" : "gridRow";
        const translateProperty: string = this.isHorizontal()
            ? "translateX"
            : "translateY";
        const offsetProperty: string = this.isHorizontal() ? "offsetLeft" : "offsetTop";
        const prev: number = this.activeIndicator[offsetProperty];
        this.activeIndicator.style[gridProperty] = `${this.activeTabIndex + 1}`;
        const next: number = this.activeIndicator[offsetProperty];
        this.activeIndicator.style[gridProperty] = `${this.prevActiveTabIndex + 1}`;
        const dif: number = next - prev;
        this.activeIndicator.style.transform = `${translateProperty}(${dif}px)`;
        this.activeIndicator.classList.add("activeIndicatorTransition");
        this.activeIndicator.addEventListener("transitionend", () => {
            this.ticking = false;
            this.activeIndicator.style[gridProperty] = `${this.activeTabIndex + 1}`;
            this.activeIndicator.style.transform = `${translateProperty}(0px)`;
            this.activeIndicator.classList.remove("activeIndicatorTransition");
        });
    }

    /**
     * The adjust method for FASTTabs
     * @public
     * @remarks
     * This method allows the active index to be adjusted by numerical increments
     */
    public adjust(adjustment: number): void {
        const focusableTabs = this.tabs.filter(t => !this.isDisabledElement(t));
        const currentActiveTabIndex = focusableTabs.indexOf(this.activetab);

        const nextTabIndex = limit(
            0,
            focusableTabs.length - 1,
            currentActiveTabIndex + adjustment
        );

        // the index of the next focusable tab within the context of all available tabs
        const nextIndex = this.tabs.indexOf(focusableTabs[nextTabIndex]);

        if (nextIndex > -1) {
            this.moveToTabByIndex(this.tabs, nextIndex);
        }
    }

    private adjustForward = (e: KeyboardEvent): void => {
        const group: HTMLElement[] = this.tabs;
        let index: number = 0;

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

    private adjustBackward = (e: KeyboardEvent): void => {
        const group: HTMLElement[] = this.tabs;
        let index: number = 0;

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

    private moveToTabByIndex = (group: HTMLElement[], index: number) => {
        const tab: HTMLElement = group[index] as HTMLElement;
        this.activetab = tab;
        this.prevActiveTabIndex = this.activeTabIndex;
        this.activeTabIndex = index;
        tab.focus();
        this.setComponent();
    };

    private focusTab(): void {
        this.tabs[this.activeTabIndex].focus();
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.tabIds = this.getTabIds();
        this.tabpanelIds = this.getTabPanelIds();
        this.activeTabIndex = this.getActiveIndex();
    }
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface FASTTabs extends StartEnd {}
applyMixins(FASTTabs, StartEnd);
