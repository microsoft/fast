import { attr, FASTElement, observable, Updates } from "@microsoft/fast-element";
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
import { applyMixins } from "../utilities/apply-mixins.js";
import { TabsOrientation } from "./tabs.options.js";

/**
 * A Tabs Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#tablist | ARIA tablist }.
 *
 * @slot start - Content which can be provided before the tablist element
 * @slot end - Content which can be provided after the tablist element
 * @slot tab - The slot for tabs
 * @slot tabpanel - The slot for tabpanels
 * @csspart tablist - The element wrapping for the tabs
 * @fires change - Fires a custom 'change' event when a tab is clicked or during keyboard navigation
 *
 * @public
 */
export class FASTTabs extends FASTElement {
    private static gridHorizontalProperty: string = "gridColumn";
    private static gridVerticalProperty: string = "gridRow";

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
            this.queueTabUpdate();
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
    public activeid: string | undefined;
    /**
     * @internal
     */
    public activeidChanged(): void {
        if (this.$fastController.isConnected || !this.updatingActiveid) {
            this.updateActiveid();
        }
    }

    /**
     * An array of id's that specifies the order of tabs.
     * If an author does not specify this (or sets it to undefined)
     * the component will create and manage the tabOrder
     * based on the order of tab elements in the DOM.
     * The component uses this to manage keyboard navigation.
     *
     * @public
     */
    @observable
    public tabOrder: string[] | undefined = [];
    /**
     * @internal
     */
    public tabOrderChanged(prev: string[] | undefined, next: string[] | undefined): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (!this.tabOrder) {
            // setting the tabOrder to undefined prompts the component take over
            this.manageTabOrder = true;
            this.tabOrder = [];
            this.queueTabUpdate();
            return;
        }

        if (!prev && next === [] && this.manageTabOrder) {
            // avoid self-triggering
            return;
        }

        // this is now an author managed list
        // Note: component code should not replace the array instance and
        // modify the existing array instead
        this.manageTabOrder = false;
        this.queueTabUpdate();
    }

    /**
     * Gets the active tab Element
     * @public
     */
    public get activetab(): HTMLElement | undefined {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (this.activeid) {
            return this.tabs.find(tab => tab.id === this.activeid);
        }
        return undefined;
    }
    /**
     * Sets the active tab Element
     * @public
     */
    public set activetab(tabElement: HTMLElement | undefined) {
        if (!this.$fastController.isConnected || !tabElement) {
            return;
        }
        if (!this.tabs.includes(tabElement) || !this.isFocusableElement(tabElement)) {
            // invalid tab element, ignore
            return;
        }
        this.activeid = tabElement.id;
    }

    /**
     * Gets the active tab index, -1 if no valid tabs
     * @public
     */
    public get activeTabIndex(): number {
        if (!this.$fastController.isConnected) {
            return -1;
        }
        if (this.tabOrder && this.activeid) {
            return this.tabOrder.findIndex(tabId => tabId === this.activeid);
        }
        return -1;
    }
    /**
     * Sets the active tab index based on tabOrder.
     * If the target tab is not focusable setting this will have no effect.
     * @public
     */
    public set activeTabIndex(index: number) {
        if (
            !this.$fastController.isConnected ||
            !this.tabOrder ||
            index < 0 ||
            index >= this.tabOrder.length
        ) {
            return;
        }
        const targetTab = this.tabs.find(tab => tab.id === this.activeid);
        if (targetTab) {
            this.activeid = targetTab.id;
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
        if (this.$fastController.isConnected) {
            this.queueTabUpdate();
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
        if (this.$fastController.isConnected) {
            this.queueTabUpdate();
        }
    }

    /**
     * Ref to the tablist element
     * @internal
     */
    public tabList!: HTMLElement;

    private manageTabOrder: boolean = true;
    private mutationObserver: MutationObserver | undefined;
    private tabUpdateQueued: boolean = false;
    private updatingActiveid: boolean = false;

    private isDisabledElement = (el: Element): el is HTMLElement => {
        return el.getAttribute("aria-disabled") === "true";
    };

    private isHiddenElement = (el: Element): el is HTMLElement => {
        return el.hasAttribute("hidden");
    };

    private isFocusableElement = (el: Element): el is HTMLElement => {
        return !this.isDisabledElement(el) && !this.isHiddenElement(el);
    };

    private isHorizontal(): boolean {
        return this.orientation === TabsOrientation.horizontal;
    }

    private isValidTabId(tabId: string): boolean {
        if (this.tabOrder && this.tabOrder.includes(tabId)) {
            return true;
        }
        return false;
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.tabList.addEventListener("mousedown", this.handleTabMouseDown);
        this.tabList.addEventListener("keydown", this.handleTabKeyDown);

        this.mutationObserver = new MutationObserver(this.onChildListChange);
        this.mutationObserver.observe(this, { childList: true });

        this.queueTabUpdate();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.tabList.removeEventListener("mousedown", this.handleTabMouseDown);
        this.tabList.removeEventListener("keydown", this.handleTabKeyDown);
        this.mutationObserver?.disconnect();
        this.mutationObserver = undefined;
    }

    /**
     * Mutation observer callback
     */
    private onChildListChange = (): void => {
        this.queueTabUpdate();
    };

    /**
     * Queues up an update after DOM changes.
     *
     */
    private queueTabUpdate(): void {
        if (this.tabUpdateQueued) {
            return;
        }
        this.tabUpdateQueued = true;
        Updates.enqueue(() => this.setTabs());
    }

    /**
     * Function that is invoked whenever the tab collection changes.
     *
     * @public
     */
    protected setTabs(): void {
        this.tabUpdateQueued = false;
        this.updateIds();

        this.tabs.forEach((tab: HTMLElement, index: number) => {
            !this.isHorizontal()
                ? tab.classList.add("vertical")
                : tab.classList.remove("vertical");
        });

        this.updateActiveid();
    }

    /**
     * Ensure all tabs and tabpanels have an id and default values
     * for id based attributes are also set.
     */
    private updateIds(): void {
        const newTabIds: string[] = [];
        const newTabPanelIds: string[] = [];
        this.tabpanels.forEach((tabPanel: HTMLElement, index: number) => {
            if (!tabPanel.hasAttribute("id")) {
                tabPanel.setAttribute("id", `panel-${uniqueId()}`);
            }
            newTabPanelIds.push(tabPanel.id);
        });
        this.tabs.forEach((tab: HTMLElement, index: number) => {
            if (!tab.hasAttribute("id")) {
                tab.setAttribute("id", `tab-${uniqueId()}`);
            }
            newTabIds.push(tab.id);
        });

        // Do a second pass to set other default id based attributes if they have not been set.
        // This enables a default behavior where tabs and tabpanels are associated based on
        // their index in the DOM (ie. first tab associated with first tab panel, etc...)
        this.tabpanels.forEach((tabPanel: HTMLElement, index: number) => {
            if (!tabPanel.hasAttribute("aria-labelledby") && newTabIds.length > index) {
                // if a tab does not already have a controlled panel defined
                // assign the id of the panel of the same index if it exists
                tabPanel.setAttribute("aria-labelledby", newTabIds[index]);
            }
        });
        this.tabs.forEach((tab: HTMLElement, index: number) => {
            if (!tab.hasAttribute("aria-controls") && newTabPanelIds.length > index) {
                // if a tab does not already have a controlled panel defined
                // assign the id of the panel of the same index if it exists
                tab.setAttribute("aria-controls", newTabPanelIds[index]);
            }
        });

        if (this.manageTabOrder && this.tabOrder) {
            this.tabOrder.splice(0, this.tabOrder.length, ...newTabIds);
        }
    }

    /**
     * Function that is invoked whenever the active tab changes.
     */
    protected updateActiveid(): void {
        if (this.updatingActiveid) {
            return;
        }
        // flag that prevents self-triggering
        this.updatingActiveid = true;

        if (!this.tabOrder || this.tabOrder.length === 0) {
            this.activeid = undefined;
        } else {
            const validTabs: HTMLElement[] = [];
            this.tabOrder.forEach((tabId: string, index: number) => {
                const tabElement: HTMLElement | undefined = this.tabs.find(
                    (tab: HTMLElement) => tab.id === tabId
                );
                if (tabElement && this.isFocusableElement(tabElement)) {
                    validTabs.push(tabElement);
                }
            });

            if (validTabs.length === 0) {
                // no valid tabs
                this.activeid === undefined;
            }

            // validate current active tab
            if (this.activeid) {
                const activeTab: HTMLElement | undefined = validTabs.find(
                    tabElement => tabElement.id === this.activeid
                );
                if (!activeTab) {
                    this.activeid === undefined;
                }
            }

            if (!this.activeid) {
                this.activeid = validTabs[0].id;
            }
        }

        const gridProperty: string = this.isHorizontal()
            ? FASTTabs.gridHorizontalProperty
            : FASTTabs.gridVerticalProperty;

        let tabElement: HTMLElement | undefined;
        let activeTab: HTMLElement | undefined;
        this.tabOrder?.forEach((tabId: string, index: number) => {
            tabElement = this.tabs.find(tab => tab.id === tabId);
            if (tabElement) {
                if (tabId === this.activeid) {
                    activeTab = tabElement;
                }
                // If the original property isn't emptied out,
                // the next set will morph into a grid-area style setting that is not what we want
                tabElement.style[FASTTabs.gridHorizontalProperty] = "";
                tabElement.style[FASTTabs.gridVerticalProperty] = "";
                tabElement.style[gridProperty] = `${index + 1}`;
                tabElement.setAttribute(
                    "aria-selected",
                    tabElement === activeTab ? "true" : "false"
                );
                tabElement.setAttribute(
                    "tabindex",
                    tabElement === activeTab ? "0" : "-1"
                );
            }
        });

        this.tabpanels.forEach((tabpanel: HTMLElement, index: number) => {
            tabpanel.id !== activeTab?.getAttribute("aria-controls")
                ? tabpanel.setAttribute("hidden", "")
                : tabpanel.removeAttribute("hidden");
        });

        this.updatingActiveid = false;
    }

    /**
     * Mousedown handler
     * @internal
     */
    public handleTabMouseDown = (event: MouseEvent): void => {
        if (event.defaultPrevented) {
            return;
        }
        const selectedTab = event.target as HTMLElement;
        if (selectedTab.nodeType === 1 && this.isFocusableElement(selectedTab)) {
            this.activeid = selectedTab.id;
        }
    };

    /**
     * Keydown handler
     * @internal
     */
    public handleTabKeyDown = (event: KeyboardEvent): void => {
        if (event.defaultPrevented) {
            return;
        }
        if (this.isHorizontal()) {
            switch (event.key) {
                case keyArrowLeft:
                    event.preventDefault();
                    this.adjust(-1);
                    break;
                case keyArrowRight:
                    event.preventDefault();
                    this.adjust(+1);
                    break;
            }
        } else {
            switch (event.key) {
                case keyArrowUp:
                    event.preventDefault();
                    this.adjust(-1);
                    break;
                case keyArrowDown:
                    event.preventDefault();
                    this.adjust(+1);
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

    private getFocusableTabs(): HTMLElement[] {
        if (!this.tabOrder) {
            return [];
        }
        const focusableTabs: HTMLElement[] = [];
        this.tabOrder.forEach(tabId => {
            const tabElement: HTMLElement | undefined = this.tabs.find(
                tab => tab.id === tabId
            );
            if (tabElement && this.isFocusableElement(tabElement)) {
                focusableTabs.push(tabElement);
            }
        });
        return focusableTabs;
    }

    /**
     * The adjust method for FASTTabs
     * @public
     * @remarks
     * This method allows the active index to be adjusted by numerical increments
     */
    public adjust(adjustment: number): void {
        if (!this.tabOrder || !this.activeid) {
            return;
        }
        const focusableTabs: HTMLElement[] = this.getFocusableTabs();
        const currentActiveTabIndex: number = focusableTabs.findIndex(
            element => element.id === this.activeid
        );
        if (currentActiveTabIndex === -1) {
            return;
        }

        const nextIndex: number = limit(
            0,
            focusableTabs.length - 1,
            currentActiveTabIndex + adjustment
        );

        if (nextIndex > -1) {
            this.activeid = focusableTabs[nextIndex].id;
            this.focusTab();
        }
    }

    private focusTab(): void {
        if (this.activetab) {
            this.activetab.focus();
        }
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
