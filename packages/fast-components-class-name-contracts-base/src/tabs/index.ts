/**
 * The class name contract for the tabs component
 */
export interface ITabsClassNameContract {
    /**
     * The root of the tabs component
     */
    tabs: string;

    /**
     * The tab oanels
     */
    tabs_tabPanels: string;

    /**
     * The tab list
     */
    tabs_tabList: string;
}

export interface ITabClassNameContract {
    /**
     * The root of the tab components
     */
    tab: string;

    /**
     * The active tab modifier
     */
    tab__active: string;
}

export interface ITabPanelClassNameContract {
    /**
     * The root of the tab panel component
     */
    tabPanel: string;

    /**
     * The hidden tab panel modifier
     */
    tabPanel__hidden: string;
}
