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
            if (tab.slot === "tab") {
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
                tab.setAttribute(
                    "style",
                    this.isHorizontal()
                        ? `grid-column: ${index + 1};`
                        : `grid-row: ${index + 1};`
                );
                tab.addEventListener("click", this.handleTabClick);
                tab.addEventListener("keydown", this.handleTabKeyDown);
                tab.setAttribute("tabindex", this.activeTabIndex === index ? "0" : "-1");
                if (this.activeTabIndex === index) {
                    this.activetab = tab;
                }
                !this.isHorizontal()
                    ? tab.classList.add("vertical")
                    : tab.classList.remove("vertical");
            }
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
                "aria-labeledby",
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
        this.activeid = this.tabIds[this.activeTabIndex] as string;
        this.change();
        this.setTabs();
        this.handleActiveIndicatorPosition();
        this.setTabPanels();
        this.focusTab();
        this.change();
    }

    private handleTabClick = (event: MouseEvent): void => {
        const selectedTab = event.target as HTMLElement;
        this.prevActiveTabIndex = this.activeTabIndex;
        this.activeTabIndex = Array.from(this.tabs).indexOf(selectedTab);
        if (selectedTab.nodeType === 1) {
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
                    this.adjust(-1);
                    break;
                case keyCodeArrowRight:
                    event.preventDefault();
                    this.adjust(1);
                    break;
            }
        } else {
            switch (keyCode) {
                case keyCodeArrowUp:
                    event.preventDefault();
                    this.adjust(-1);
                    break;
                case keyCodeArrowDown:
                    event.preventDefault();
                    this.adjust(1);
                    break;
            }
        }
        switch (keyCode) {
            case keyCodeHome:
                event.preventDefault();
                this.activeTabIndex = 0;
                this.setComponent();
                break;
            case keyCodeEnd:
                event.preventDefault();
                this.activeTabIndex = this.tabs.length - 1;
                this.setComponent();
                break;
        }
    };

    private handleActiveIndicatorPosition() {
        if (this.activeindicator) {
            if (this.ticking) {
                this.activeIndicatorRef.style.transform = "translateX(0px)";
                this.activeIndicatorRef.classList.remove("activeIndicatorTransition");
                if (this.isHorizontal()) {
                    this.activeIndicatorRef.style.gridColumn = `${
                        this.activeTabIndex + 1
                    }`;
                } else {
                    this.activeIndicatorRef.style.gridRow = `${this.activeTabIndex + 1}`;
                }
                this.ticking = false;
            } else {
                this.ticking = true;

                this.animateActiveIndicator();
            }
        }
    }

    private animateActiveIndicator(): void {
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

    private adjust(adjustment: number): void {
        this.prevActiveTabIndex = this.activeTabIndex;
        this.activeTabIndex = wrapInBounds(
            0,
            this.tabs.length - 1,
            this.activeTabIndex + adjustment
        );
        this.setComponent();
    }

    private focusTab(): void {
        this.tabs[this.activeTabIndex].focus();
    }

    constructor() {
        super();

        if (this.$fastController.isConnected) {
            this.tabIds = this.getTabIds();
            this.tabpanelIds = this.getTabPanelIds();
            this.activeTabIndex = this.getActiveIndex();
        }
    }
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * https://github.com/microsoft/rushstack/issues/1921
 * @internal
 */
/* eslint-disable-next-line */
export interface Tabs extends StartEnd {}
applyMixins(Tabs, StartEnd);
