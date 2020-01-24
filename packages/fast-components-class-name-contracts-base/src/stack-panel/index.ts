/**
 * The class name contract for the stackpanel component
 */
export interface StackPanelClassNameContract {
    /**
     * The root of the stackpanel component
     */
    stackPanel?: string;

    /**
     * the container that contains the stack panel items
     */
    stackPanel_itemContainer?: string;

    /**
     * indicates that the panel is scrollable
     * (ie. contents exceed height of container)
     */
    stackPanel__isScrolling?: string;

    /**
     *
     */
    stackPanel_item?: string;

    /**
     *
     */
    stackPanel_item__focusWithin?: string;
}
