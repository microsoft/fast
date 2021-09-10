import { HoverLocation } from "./navigation.props";

export enum VerticalDragDirection {
    up,
    down,
    center,
}

export enum DragDropItemType {
    rootLinkedData = "root-linked-data",
    rootLinkedDataUndroppable = "root-linked-data-undroppable",
    linkedData = "linked-data",
    linkedDataUndroppable = "linked-data-undroppable",
    linkedDataContainer = "linked-data-container",
    undraggableUndroppable = "undraggable-undroppable",
}

export interface NavigationTreeItemProps
    extends NavigationTreeItemDragSourceCollectedProps,
        NavigationTreeItemDropTargetCollectedProps {
    /**
     * The type of item for drag and drop
     */
    type: DragDropItemType;

    /**
     * The class names assigned to style the drag item
     */
    className: string;

    /**
     * The class name assigned to the expand trigger
     */
    expandTriggerClassName: string;

    /**
     * The class name assigned to the items content
     */
    contentClassName: string;

    /**
     * The class name assigned to the display text input
     */
    displayTextInputClassName: string;

    /**
     * The dictionary ID
     */
    dictionaryId: string;

    /**
     * The index of this drag item
     */
    index: number;

    /**
     * The navigation ID
     */
    navigationConfigId: string;

    /**
     * Whether this navigation item is collapsible
     */
    isCollapsible: boolean;

    /**
     * Whether this navigation item is editable
     */
    isEditing: boolean;

    /**
     * The React ref for the input element
     */
    inputRef: React.RefObject<HTMLInputElement>;

    /**
     * The text content
     */
    text: string;

    /**
     * The click handler for expanding an item
     */
    handleExpandClick: React.MouseEventHandler<HTMLElement>;

    /**
     * The click handler for activating an item
     */
    handleClick: React.MouseEventHandler<HTMLElement>;

    /**
     * The change handler for updating an items display text
     */
    handleInputChange: React.ChangeEventHandler<HTMLInputElement>;

    /**
     * The blur handler for defocusing the display text input
     */
    handleInputBlur: React.FocusEventHandler<HTMLInputElement>;

    /**
     * The keydown handler for the display text input
     */
    handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement>;

    /**
     * The keyDown handler
     */
    handleKeyDown: React.KeyboardEventHandler<HTMLElement>;

    /**
     * Callback for starting the drag
     */
    dragStart: (dictionaryId: string) => void;

    /**
     * Callback for ending the drag
     */
    dragEnd: () => void;

    /**
     * Callback for hovering an item
     */
    dragHover: (
        type: DragDropItemType,
        dictionaryId: string,
        navigationConfigId: string,
        index: number,
        location: HoverLocation
    ) => void;
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
