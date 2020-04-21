import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeHome,
} from "@microsoft/fast-web-utilities";

export enum TabsOrientation {
    vertical = "vertical",
    horizontal = "horizontal",
}

export class Tabs extends FASTElement {
    @attr
    public orientation: TabsOrientation = TabsOrientation.horizontal;
    private orientationChanged(): void {
        this.orientation === TabsOrientation.vertical
            ? this.classList.add("vertical")
            : this.classList.remove("vertical");
    }

    @attr
    public activeId: string;

    @observable
    public tabs: HTMLElement[];
    public tabsChanged(): void {
        if (this.connected && this.tabs.length <= this.tabPanels.length) {
            this.getTabs();
            this.getTabPanels();
            this.handleActiveIndicatorPosition();
        }
    }

    @observable
    public tabPanels: HTMLElement[];
    public tabPanelsChanged(): void {
        if (this.connected && this.tabPanels.length <= this.tabs.length) {
            this.getTabs();
            this.getTabPanels();
            this.handleActiveIndicatorPosition();
        }
    }

    public start: HTMLSlotElement;
    public startContainer: HTMLDivElement;
    public handleStartContentChange(): void {
        this.start.assignedNodes().length > 0
            ? this.startContainer.classList.add("start")
            : this.startContainer.classList.remove("start");
    }

    public end: HTMLSlotElement;
    public endContainer: HTMLDivElement;
    public handleEndContentChange(): void {
        this.end.assignedNodes().length > 0
            ? this.endContainer.classList.add("end")
            : this.endContainer.classList.remove("end");
    }

    public change = (): void => {
        this.$emit("change", this.activeTab);
    };

    @attr({ mode: "boolean" })
    public activeIndicator = true;

    @observable
    public activeIndicatorOffset: number = 0;
    public activeIndicatorRef: HTMLElement;
    public activeTabIndex: number = 0;
    public activeTab: HTMLElement;

    private prevActiveTabIndex: number = 0;
    private ticking: boolean = false;
    private tabIDs: string[];
    private tabPanelIDs: string[];
    private connected: boolean = false;

    private getActiveIndex(): number {
        if (this.activeId !== undefined) {
            return this.tabIDs.indexOf(this.activeId) === -1
                ? 0
                : this.tabIDs.indexOf(this.activeId);
        } else {
            return 0;
        }
    }

    private getTabs = (): void => {
        this.tabIDs = this.getTabIds();
        this.tabPanelIDs = this.getTabPanelIds();
        this.activeTabIndex = this.getActiveIndex();
        this.tabs.forEach((tab: HTMLElement, index: number) => {
            if (tab.slot === "tab") {
                tab.setAttribute(
                    "id",
                    this.tabIDs[index] === undefined || this.tabIDs[index] === null
                        ? `tab-${index + 1}`
                        : this.tabIDs[index]
                );
                tab.setAttribute(
                    "aria-selected",
                    this.activeTabIndex === index ? "true" : "false"
                );
                tab.setAttribute(
                    "aria-controls",
                    this.tabPanelIDs[index] === undefined ||
                        this.tabPanelIDs[index] === null
                        ? `panel-${index + 1}`
                        : this.tabPanelIDs[index]
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
                    this.activeTab = tab;
                }
                !this.isHorizontal()
                    ? tab.classList.add("vertical")
                    : tab.classList.remove("vertical");
            }
        });
    };

    private getTabPanels = (): void => {
        this.tabIDs = this.getTabIds();
        this.tabPanelIDs = this.getTabPanelIds();
        this.tabPanels.forEach((tabpanel: HTMLElement, index: number) => {
            tabpanel.setAttribute(
                "id",
                this.tabPanelIDs[index] === undefined || this.tabPanelIDs[index] === null
                    ? `panel-${index + 1}`
                    : this.tabPanelIDs[index]
            );
            tabpanel.setAttribute(
                "aria-labeledby",
                this.tabIDs[index] === undefined || this.tabIDs[index] === null
                    ? `tab-${index + 1}`
                    : this.tabIDs[index]
            );
            this.activeTabIndex !== index
                ? tabpanel.setAttribute("hidden", "")
                : tabpanel.removeAttribute("hidden");
        });
    };

    private getTabIds(): string[] {
        return this.tabs.map((tab: HTMLElement) => {
            return tab.getAttribute("id") as string;
        });
    }

    private getTabPanelIds(): string[] {
        return this.tabPanels.map((tabPanel: HTMLElement) => {
            return tabPanel.getAttribute("id") as string;
        });
    }

    private setTabs(): void {
        this.activeId = this.tabIDs[this.activeTabIndex];
        this.change();
        this.getTabs();
        this.handleActiveIndicatorPosition();
        this.getTabPanels();
        this.focusTab();
        this.change();
    }

    private handleTabClick = (event): void => {
        const selectedTab = event.srcElement as Element;
        this.prevActiveTabIndex = this.activeTabIndex;
        this.activeTabIndex = Array.from(this.tabs).indexOf(event.target);
        if (selectedTab.nodeType === 1) {
            this.setTabs();
        }
    };

    private isHorizontal(): boolean {
        return this.orientation === TabsOrientation.horizontal;
    }

    private handleTabKeyDown = (event: KeyboardEvent): void => {
        const keyCode: number = event.keyCode;
        const tabsLength: number = this.tabs.length;
        if (this.isHorizontal()) {
            switch (keyCode) {
                case keyCodeArrowLeft:
                    event.preventDefault();
                    this.decrement(tabsLength);
                    break;
                case keyCodeArrowRight:
                    event.preventDefault();
                    this.increment(tabsLength);
                    break;
            }
        } else {
            switch (keyCode) {
                case keyCodeArrowUp:
                    event.preventDefault();
                    this.decrement(tabsLength);
                    break;
                case keyCodeArrowDown:
                    event.preventDefault();
                    this.increment(tabsLength);
                    break;
            }
        }
        switch (keyCode) {
            case keyCodeHome:
                event.preventDefault();
                this.activeTabIndex = 0;
                this.setTabs();
                break;
            case keyCodeEnd:
                event.preventDefault();
                this.activeTabIndex = tabsLength - 1;
                this.setTabs();
                break;
        }
    };

    private handleActiveIndicatorPosition() {
        if (this.activeIndicator) {
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
        if (this.isHorizontal()) {
            const prev: number = this.activeIndicatorRef.offsetLeft;
            this.activeIndicatorRef.style.gridColumn = `${this.activeTabIndex + 1}`;
            const next: number = this.activeIndicatorRef.offsetLeft;
            this.activeIndicatorRef.style.gridColumn = `${this.prevActiveTabIndex + 1}`;
            const dif: number = next - prev;
            this.activeIndicatorRef.style.transform = `translateX(${dif}px)`;
            this.activeIndicatorRef.classList.add("activeIndicatorTransition");
            this.activeIndicatorRef.addEventListener("transitionend", () => {
                this.ticking = false;
                this.activeIndicatorRef.style.gridColumn = `${this.activeTabIndex + 1}`;
                this.activeIndicatorRef.style.transform = "translateX(0px)";
                this.activeIndicatorRef.classList.remove("activeIndicatorTransition");
            });
        } else {
            const prev: number = this.activeIndicatorRef.offsetTop;
            this.activeIndicatorRef.style.gridRow = `${this.activeTabIndex + 1}`;
            const next: number = this.activeIndicatorRef.offsetTop;
            this.activeIndicatorRef.style.gridRow = `${this.prevActiveTabIndex + 1}`;
            const dif: number = next - prev;
            this.activeIndicatorRef.style.transform = `translateY(${dif}px)`;
            this.activeIndicatorRef.classList.add("activeIndicatorTransition");
            this.activeIndicatorRef.addEventListener("transitionend", () => {
                this.ticking = false;
                this.activeIndicatorRef.style.gridRow = `${this.activeTabIndex + 1}`;
                this.activeIndicatorRef.style.transform = "translateX(0px)";
                this.activeIndicatorRef.classList.remove("activeIndicatorTransition");
            });
        }
    }

    private decrement(tabsLength: number): void {
        this.prevActiveTabIndex = this.activeTabIndex;
        if (this.activeTabIndex !== 0) {
            this.activeTabIndex = this.activeTabIndex - 1;
        } else {
            this.activeTabIndex = tabsLength - 1;
        }
        this.setTabs();
    }

    private increment(tabsLength: number): void {
        this.prevActiveTabIndex = this.activeTabIndex;
        if (this.activeTabIndex !== tabsLength - 1) {
            this.activeTabIndex = this.activeTabIndex + 1;
        } else {
            this.activeTabIndex = 0;
        }
        this.setTabs();
    }

    private focusTab(): void {
        const tb = this.tabs as HTMLElement[];
        tb[this.activeTabIndex].focus();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.connected = true;
    }

    constructor() {
        super();

        if (this.connected) {
            this.tabIDs = this.getTabIds();
            this.tabPanelIDs = this.getTabPanelIds();
            this.activeTabIndex = this.getActiveIndex();
        }
    }
}
