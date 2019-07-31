import { NavigationDataType } from "./navigation.props";

export enum VerticalDragDirection {
    up,
    down,
    center,
}

export interface NavigationTreeItemProps
    extends NavigationTreeItemDragSourceCollectedProps,
        NavigationTreeItemDropTargetCollectedProps {
    /**
     * The React children
     */
    children?: React.ReactNode;

    /**
     * The class
     */
    className: (dragging: boolean) => string;

    /**
     * The class for the content
     */
    contentClassName: string;

    /**
     * The class for the expand trigger
     */
    expandTriggerClassName: string;

    /**
     * A string representing the data location in lodash notation
     */
    dataLocation: string;

    /**
     * The expanded state
     */
    expanded: boolean;

    /**
     * The click handler for expanding an item
     */
    handleClick: React.MouseEventHandler<HTMLElement>;

    /**
     * The click handler for selecting an item
     */
    handleSelectionClick: React.MouseEventHandler<HTMLElement>;

    /**
     * The keyDown handler
     */
    handleKeyDown: React.KeyboardEventHandler<HTMLElement>;

    /**
     * The handler for closing dragging items
     */
    handleCloseDraggingItem: (dataLocation: string, type: NavigationDataType) => void;

    /**
     * The text used for the tree item
     */
    text: string;

    /**
     * The type of data this tree item represents
     */
    type: NavigationDataType;

    /**
     * The drag hover state
     */
    dragHover: boolean;

    /**
     * The drag hover before state
     */
    dragHoverBefore: boolean;

    /**
     * The drag hover after state
     */
    dragHoverAfter: boolean;

    /**
     * The onChange callback for updating the data
     */
    onChange: (
        sourceDataLocation: string,
        targetDataLocation: string,
        type?: NavigationDataType,
        direction?: VerticalDragDirection
    ) => void;

    /**
     * The hover callback for dragging
     */
    onDragHover: (dataLocation: string, direction?: VerticalDragDirection) => void;

    /**
     * The class for hovering when dragging
     */
    getContentDragHoverClassName: (
        type: NavigationDataType,
        direction?: VerticalDragDirection
    ) => string;
}

export interface NavigationTreeItemDragSourceCollectedProps {
    connectDragSource?: (el: JSX.Element) => JSX.Element;
    isDragging?: boolean;
}

export interface NavigationTreeItemDropTargetCollectedProps {
    connectDropTarget?: (el: JSX.Element) => JSX.Element;
    canDrop?: boolean;
    isOver?: boolean;
}

export interface NavigationTreeItemDragObject {
    dataLocation: string;
}
