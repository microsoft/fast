import { NavigationDataType } from "./navigation.props";

export enum VerticalDragDirection {
    up,
    down,
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
    className: string;

    /**
     * The class for the content
     */
    contentClassName: string;

    /**
     * A string representing the data location in lodash notation
     */
    dataLocation: string;

    /**
     * The expanded state
     */
    expanded: boolean;

    /**
     * The click handler
     */
    handleClick: React.MouseEventHandler<HTMLElement>;

    /**
     * The keyUp handler
     */
    handleKeyUp: React.KeyboardEventHandler<HTMLElement>;

    /**
     * The level, used for the tree items aria-level
     */
    level: number;

    /**
     * The length of the navigation, used for the tree items aria-setsize
     */
    navigationLength: number;

    /**
     * The position of the tree item in the navigation, used for the tree items aria-posinset
     */
    positionInNavigation: number;

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
