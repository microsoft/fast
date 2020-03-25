import { NavigationConfig, TreeNavigationItem } from "@microsoft/fast-tooling";

export enum VerticalDragDirection {
    up,
    down,
    center,
}

export enum DragDropItemType {
    default = "default",
    linkedData = "linked-data",
    linkedDataContainer = "linked-data-container",
}

export interface NavigationTreeItemProps
    extends NavigationTreeItemDragSourceCollectedProps,
        NavigationTreeItemDropTargetCollectedProps {
    /**
     * The React ref
     */
    ref?: (node: HTMLDivElement | HTMLAnchorElement) => React.ReactElement<any>;

    /**
     * The type of item for drag and drop
     */
    type: DragDropItemType;

    /**
     * The tree navigation item
     */
    item: TreeNavigationItem;

    /**
     * The React children
     */
    children?: React.ReactNode;

    /**
     * The class name for the content
     */
    contentClassName: (dragging: boolean, canDrag: boolean) => string;

    /**
     * The class name for the link
     */
    linkClassName: (dragging: boolean, canDrag: boolean) => string;

    /**
     * The expanded state
     */
    expanded: boolean;

    /**
     * The dictionary ID
     */
    dictionaryId: string;

    /**
     * The navigation ID
     */
    navigationConfigId: string;

    /**
     * Whether this navigation item is draggable
     */
    isDraggable: boolean;

    /**
     * Whether this is the current linked data item being dragged
     */
    isCurrentDragItem: boolean;

    /**
     * The click handler for expanding an item
     */
    handleClick: React.MouseEventHandler<HTMLElement>;

    /**
     * The keyDown handler
     */
    handleKeyDown: React.KeyboardEventHandler<HTMLElement>;

    /**
     * Callback for moving the item
     */
    moveDragItem: (
        type: DragDropItemType,
        dictionaryId: string,
        navigationConfigId: string
    ) => void;

    /**
     * Callback for dropping the item
     */
    dropDragItem: (type: DragDropItemType) => void;

    /**
     * Callback for starting the drag
     */
    dragStart: (dictionaryId: string) => void;

    /**
     * Callback for ending the drag
     */
    dragEnd: () => void;
}

export interface NavigationTreeItemDragSourceCollectedProps {
    connectDragSource?: (el: JSX.Element) => JSX.Element;
    isDragging?: boolean;
}

export interface NavigationTreeItemDropTargetCollectedProps {
    connectDropTarget?: (el: JSX.Element) => JSX.Element;
    isOver?: boolean;
}

export interface NavigationTreeItemDragObject {
    dictionaryId: string;
    navigationConfigId: string;
}
