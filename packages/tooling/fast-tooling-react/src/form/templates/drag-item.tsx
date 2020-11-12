import React from "react";
import {
    ConnectDragSource,
    ConnectDropTarget,
    DragElementWrapper,
    DragPreviewOptions,
    DragSourceOptions,
    DropTargetMonitor,
    useDrag,
    useDrop,
} from "react-dnd";
import { ArrayAction } from "./types";
import { DragItem, DragItemProps, ItemType } from "./drag-item.props";

const DragItem: React.FC<DragItemProps> = ({
    children,
    itemRemoveClassName,
    itemClassName,
    itemLinkClassName,
    minItems,
    itemLength,
    index,
    onClick,
    removeDragItem,
    moveDragItem,
    dropDragItem,
    dragStart,
    dragEnd,
    strings,
}: React.PropsWithChildren<DragItemProps>): React.ReactElement => {
    const drag: [
        unknown,
        DragElementWrapper<DragSourceOptions>,
        DragElementWrapper<DragPreviewOptions>
    ] = useDrag({
        item: {
            type: ItemType.ListItem,
            index,
        },
        begin(): void {
            dragStart();
        },
        end(): void {
            dragEnd();
        },
    });
    const dragSource: ConnectDragSource = drag[1] as ConnectDragSource;
    const drop: [
        {
            isOver: boolean;
        },
        DragElementWrapper<any>
    ] = useDrop({
        accept: ItemType.ListItem,
        hover({ index: draggedIndex }: DragItem): void {
            moveDragItem(draggedIndex, index);
        },
        drop({ index: draggedIndex }: DragItem): void {
            if (draggedIndex !== index) {
                dropDragItem();
            }
        },
        collect: (monitor: DropTargetMonitor): { isOver: boolean } => ({
            isOver: monitor.isOver(),
        }),
    });
    const dropTarget: ConnectDropTarget = drop[1] as ConnectDropTarget;
    const isOver: boolean = (drop[0] as { isOver: boolean }).isOver;
    const renderDeleteArrayItemTrigger: (itemIndex: number) => React.ReactNode = (
        itemIndex: number
    ): React.ReactNode => {
        const min: number = (minItems || 0) as number;

        if (min < itemLength) {
            return (
                <button
                    className={itemRemoveClassName}
                    aria-label={strings.dragItemRemoveItem}
                    onClick={removeDragItem(ArrayAction.remove, itemIndex)}
                />
            );
        }
    };

    return (
        <li
            ref={(node: HTMLLIElement): React.ReactElement =>
                dragSource(dropTarget(node))
            }
            style={isOver ? { opacity: 0 } : null}
            className={itemClassName}
        >
            <a className={itemLinkClassName} onClick={onClick(index)}>
                {children}
            </a>
            {renderDeleteArrayItemTrigger(index)}
        </li>
    );
};

export default DragItem;
