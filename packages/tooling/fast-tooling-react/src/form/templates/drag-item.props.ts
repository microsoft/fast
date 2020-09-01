import { ArrayAction } from "./types";

export interface DragItemProps {
    /**
     * Class name for the drag item
     */
    itemClassName: string;

    /**
     * Class name for removing the item trigger
     */
    itemRemoveClassName: string;

    /**
     * Class name for the items link
     */
    itemLinkClassName: string;

    /**
     * Minimum number of items
     */
    minItems: number | undefined;

    /**
     * The number of items
     */
    itemLength: number;

    /**
     * The index in the array of items
     */
    index: number;

    /**
     * The onClick for the item
     */
    onClick: (
        index: number
    ) => (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

    /**
     * Callback for removing the item
     */
    removeDragItem: (
        type: ArrayAction,
        index?: number
    ) => (e: React.MouseEvent<HTMLButtonElement>) => void;

    /**
     * Callback for moving the item
     */
    moveDragItem: (sourceIndex: number, targetIndex: number) => void;

    /**
     * Callback for dropping the item
     */
    dropDragItem: () => void;

    /**
     * Callback for starting the drag
     */
    dragStart: () => void;

    /**
     * Callback for ending the drag
     */
    dragEnd: () => void;
}

export enum ItemType {
    ListItem = "ListItem",
}

export interface DragItem {
    type: string;
    index: number;
}

export interface DragState {
    /**
     * The current array
     * This is used so that while dragging the data is not being updated through the
     * form until it has been dropped
     */
    data: unknown[] | undefined;

    /**
     * Is an item currently being dragged
     */
    isDragging: boolean;
}
