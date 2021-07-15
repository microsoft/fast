import { StartEnd } from "../patterns/start-end";
import { FoundationElement } from "../foundation-element";
/**
 * The orientation of the {@link @microsoft/fast-foundation#(Tabs:class)} component
 * @public
 */
export declare enum TabsOrientation {
    vertical = "vertical",
    horizontal = "horizontal",
}
/**
 * A Tabs Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#tablist | ARIA tablist }.
 *
 * @public
 */
export declare class Tabs extends FoundationElement {
    /**
     * The orientation
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    orientation: TabsOrientation;
    /**
     * The id of the active tab
     *
     * @public
     * @remarks
     * HTML Attribute: activeid
     */
    activeid: string;
    /**
     * @internal
     */
    activeidChanged(): void;
    /**
     * @internal
     */
    tabs: HTMLElement[];
    /**
     * @internal
     */
    tabsChanged(): void;
    /**
     * @internal
     */
    tabpanels: HTMLElement[];
    /**
     * @internal
     */
    tabpanelsChanged(): void;
    /**
     * Whether or not to show the active indicator
     * @public
     * @remarks
     * HTML Attribute: activeindicator
     */
    activeindicator: boolean;
    /**
     * @internal
     */
    activeIndicatorRef: HTMLElement;
    /**
     * @internal
     */
    showActiveIndicator: boolean;
    /**
     * A reference to the active tab
     * @public
     */
    activetab: HTMLElement;
    private prevActiveTabIndex;
    private activeTabIndex;
    private ticking;
    private tabIds;
    private tabpanelIds;
    private change;
    private isDisabledElement;
    private isFocusableElement;
    private getActiveIndex;
    private setTabs;
    private setTabPanels;
    private getTabIds;
    private getTabPanelIds;
    private setComponent;
    private handleTabClick;
    private isHorizontal;
    private handleTabKeyDown;
    private handleActiveIndicatorPosition;
    private animateActiveIndicator;
    /**
     * The adjust method for FASTTabs
     * @public
     * @remarks
     * This method allows the active index to be adjusted by numerical increments
     */
    adjust(adjustment: number): void;
    private adjustForward;
    private adjustBackward;
    private moveToTabByIndex;
    private focusTab;
    /**
     * @internal
     */
    connectedCallback(): void;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface Tabs extends StartEnd {}
