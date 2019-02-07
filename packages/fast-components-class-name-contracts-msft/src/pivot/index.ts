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
     * The collection of pivot items
     */
    pivot_itemList?: string;

    /**
     * The pivot item
     */
    pivot_item?: string;

    /**
     * The active pivot item
     */
    pivot_item__active?: string;

    /**
     * The active picot item indicator
     */
    pivot_item__activeIndicator?: string;

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
