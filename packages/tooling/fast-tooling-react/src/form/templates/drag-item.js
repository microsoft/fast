import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { ArrayAction } from "./types";
import { ItemType } from "./drag-item.props";
const DragItem = ({
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
}) => {
    const drag = useDrag({
        item: {
            type: ItemType.ListItem,
            index,
        },
        begin() {
            dragStart();
        },
        end() {
            dragEnd();
        },
    });
    const dragSource = drag[1];
    const drop = useDrop({
        accept: ItemType.ListItem,
        hover({ index: draggedIndex }) {
            moveDragItem(draggedIndex, index);
        },
        drop({ index: draggedIndex }) {
            if (draggedIndex !== index) {
                dropDragItem();
            }
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
        }),
    });
    const dropTarget = drop[1];
    const isOver = drop[0].isOver;
    const renderDeleteArrayItemTrigger = itemIndex => {
        const min = minItems || 0;
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
            ref={node => dragSource(dropTarget(node))}
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
