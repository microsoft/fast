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
    stackPanel_items?: string;

    /**
     * indicates that the panel is scrollable
     * (ie. contents exceed height of container)
     */
    stackPanel__scrolling?: string;
}
