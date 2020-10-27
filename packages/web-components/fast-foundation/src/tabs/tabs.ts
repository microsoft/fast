import { attr, FASTElement, observable } from "@microsoft/fast-element";
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

/**
 * The orientation of the {@link @microsoft/fast-foundation#(Tabs:class)} component
 * @public
 */
export enum TabsOrientation {
    vertical = "vertical",
    horizontal = "horizontal",
}

/**
 * An Tabs Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#tablist | ARIA tablist }.
 *
 * @public
 */
export class Tabs extends FASTElement {
    /**
     * The orientation
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    @attr
    public orientation: TabsOrientation = TabsOrientation.horizontal;

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
    public activeidChanged(): void {
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
    @attr({ mode: "boolean" })
    public activeindicator = true;

    /**
     * @internal
     */
    @observable
    public activeIndicatorRef: HTMLElement;

    /**
     * A reference to the active tab
     * @public
     */
    public activetab: HTMLElement;

    private prevActiveTabIndex: number = 0;
    private activeTabIndex: number = 0;
    private ticking: boolean = false;
    private tabIds: Array<string | null>;
    private tabpanelIds: Array<string | null>;

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
        this.tabIds = this.getTabIds();
        this.tabpanelIds = this.getTabPanelIds();
        this.activeTabIndex = this.getActiveIndex();
        this.tabs.forEach((tab: HTMLElement, index: number) => {
            if (tab.slot === "tab" && this.isFocusableElement(tab)) {
                const tabId: string | null = this.tabIds[index];
                const tabpanelId: string | null = this.tabpanelIds[index];
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
                tab.setAttribute("tabindex", this.activeTabIndex === index ? "0" : "-1");
                if (this.activeTabIndex === index) {
                    this.activetab = tab;
                }
            }
            tab.setAttribute(
                "style",
                this.isHorizontal()
                    ? `grid-column: ${index + 1};`
                    : `grid-row: ${index + 1};`
            );
            !this.isHorizontal()
                ? tab.classList.add("vertical")
                : tab.classList.remove("vertical");
        });
    };

    private setTabPanels = (): void => {
        this.tabIds = this.getTabIds();
        this.tabpanelIds = this.getTabPanelIds();
        this.tabpanels.forEach((tabpanel: HTMLElement, index: number) => {
            const tabId: string | null = this.tabIds[index];
            const tabpanelId: string | null = this.tabpanelIds[index];
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

    private getTabIds(): Array<string | null> {
        return this.tabs.map((tab: HTMLElement) => {
            return tab.getAttribute("id");
        });
    }

    private getTabPanelIds(): Array<string | null> {
        return this.tabpanels.map((tabPanel: HTMLElement) => {
            return tabPanel.getAttribute("id") as string;
        });
    }

    private setComponent(): void {
        if (this.activeTabIndex !== this.prevActiveTabIndex) {
            this.activeid = this.tabIds[this.activeTabIndex] as string;
            this.change();
            this.setTabs();
            this.handleActiveIndicatorPosition();
            this.setTabPanels();
            this.focusTab();
            this.change();
        }
    }

    private handleTabClick = (event: MouseEvent): void => {
        const selectedTab = event.currentTarget as HTMLElement;
        if (selectedTab.nodeType === 1) {
            this.prevActiveTabIndex = this.activeTabIndex;
            this.activeTabIndex = Array.from(this.tabs).indexOf(selectedTab);
            this.setComponent();
        }
    };

    private isHorizontal(): boolean {
        return this.orientation === TabsOrientation.horizontal;
    }

    private handleTabKeyDown = (event: KeyboardEvent): void => {
        const keyCode: number = event.keyCode;
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

    private handleActiveIndicatorPosition() {
        // Ignore if we click twice on the same tab
        if (this.activeindicator && this.activeTabIndex !== this.prevActiveTabIndex) {
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
        const prev: number = this.activeIndicatorRef[offsetProperty];
        this.activeIndicatorRef.style[gridProperty] = `${this.activeTabIndex + 1}`;
        const next: number = this.activeIndicatorRef[offsetProperty];
        this.activeIndicatorRef.style[gridProperty] = `${this.prevActiveTabIndex + 1}`;
        const dif: number = next - prev;
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
    public adjust(adjustment: number): void {
        this.prevActiveTabIndex = this.activeTabIndex;
        this.activeTabIndex = wrapInBounds(
            0,
            this.tabs.length - 1,
            this.activeTabIndex + adjustment
        );
        this.setComponent();
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
export interface Tabs extends StartEnd {}
applyMixins(Tabs, StartEnd);
