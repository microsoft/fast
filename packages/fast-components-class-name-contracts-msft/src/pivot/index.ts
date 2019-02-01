import { TabsClassNameContract as BaseTabsClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the button component
 */
export interface PivotClassNameContract extends BaseTabsClassNameContract {
    /**
     * The root of the pivot component
     */
    pivot?: string;

    /**
     * The collection of sequence indicators
     */
    pivot_itemList?: string;

    /**
     * The sequence indicator
     */
    pivot_item?: string;

    /**
     * The active pivot sequence indicator
     */
    pivot_item__active?: string;

    /**
     * The collection of tab panels
     */
    pivot_tabPanels?: string;

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
