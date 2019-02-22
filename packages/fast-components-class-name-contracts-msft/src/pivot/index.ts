import { TabsClassNameContract as BaseTabsClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the pivot component
 */
export interface PivotClassNameContract extends BaseTabsClassNameContract {
    /**
     * The root of the pivot component
     */
    pivot?: string;

    /**
     * The active pivot indicator
     */
    pivot_activeIndicator?: string;

    /**
     * The collection of pivot items
     */
    pivot_tabList?: string;

    /**
     * The pivot item
     */
    pivot_tab?: string;

    /**
     * The active pivot item
     */
    pivot_tab__active?: string;

    /**
     * The pivot tab content
     */
    pivot_tabContent?: string;

    /**
     * The collection of tab panels
     */
    pivot_tabPanels?: string;

    /**
     * The previous panel from left
     */
    pivot_tabPanels__previous?: string;

    /**
     * The next tab panel
     */
    pivot_tabPanels__next?: string;

    /**
     * The tab panel
     */
    pivot_tabPanel?: string;

    /**
     * The hidden tab panel
     */
    pivot_tabPanel__hidden?: string;

    /**
     * The tab panel content
     */
    pivot_tabPanelContent?: string;
}
