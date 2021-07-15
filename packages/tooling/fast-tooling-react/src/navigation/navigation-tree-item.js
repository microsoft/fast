import React from "react";
import { DragDropItemType } from "./navigation-tree-item.props";
import { useDrag, useDrop } from "react-dnd";
import { HoverLocation } from "./navigation.props";
function editableOverlay(
    className,
    value,
    handleInputChange,
    handleInputBlur,
    handleInputKeyDown
) {
    return (
        <input
            className={className}
            key={"overlay"}
            value={value}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
        />
    );
}
function treeItem(
    handleClick,
    handleInputChange,
    handleInputBlur,
    handleInputKeyDown,
    handleExpandClick,
    handleKeyDown,
    isEditable,
    isCollapsible,
    className,
    expandTriggerClassName,
    contentClassName,
    displayTextInputClassName,
    text,
    dictionaryId,
    navigationConfigId,
    ref
) {
    const displayText = isEditable
        ? editableOverlay(
              displayTextInputClassName,
              text,
              handleInputChange,
              handleInputBlur,
              handleInputKeyDown
          )
        : isCollapsible
        ? treeItemCollapsible(
              handleClick,
              handleKeyDown,
              contentClassName,
              text,
              dictionaryId,
              navigationConfigId,
              ref
          )
        : treeItemEndLeaf(
              handleClick,
              handleKeyDown,
              contentClassName,
              text,
              dictionaryId,
              navigationConfigId,
              ref
          );
    return (
        <span className={className}>
            <span className={expandTriggerClassName} onClick={handleExpandClick} />
            {displayText}
        </span>
    );
}
function treeItemEndLeaf(
    handleClick,
    handleKeyDown,
    contentClassName,
    text,
    dictionaryId,
    navigationConfigId,
    ref
) {
    return (
        <a
            className={contentClassName}
            onClick={handleClick}
            ref={ref}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            data-dictionaryid={dictionaryId}
            data-navigationconfigid={navigationConfigId}
        >
            {text}
        </a>
    );
}
function treeItemCollapsible(
    handleClick,
    handleKeyDown,
    contentClassName,
    text,
    dictionaryId,
    navigationConfigId,
    ref
) {
    return (
        <span
            className={contentClassName}
            onClick={handleClick}
            ref={ref}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            data-dictionaryid={dictionaryId}
            data-navigationconfigid={navigationConfigId}
        >
            {text}
        </span>
    );
}
export const NavigationTreeItem = ({
    text,
    className,
    expandTriggerClassName,
    contentClassName,
    displayTextInputClassName,
    isEditable,
    isCollapsible,
    handleClick,
    handleInputChange,
    handleInputBlur,
    handleInputKeyDown,
    handleExpandClick,
    handleKeyDown,
    dictionaryId,
    navigationConfigId,
}) => {
    return treeItem(
        handleClick,
        handleInputChange,
        handleInputBlur,
        handleInputKeyDown,
        handleExpandClick,
        handleKeyDown,
        isEditable,
        isCollapsible,
        className,
        expandTriggerClassName,
        contentClassName,
        displayTextInputClassName,
        text,
        dictionaryId,
        navigationConfigId
    );
};
export const DraggableNavigationTreeItem = ({
    type,
    text,
    handleClick,
    handleInputChange,
    handleInputBlur,
    handleInputKeyDown,
    handleExpandClick,
    handleKeyDown,
    className,
    expandTriggerClassName,
    contentClassName,
    displayTextInputClassName,
    isCollapsible,
    isEditable,
    dragStart,
    dragEnd,
    dragHover,
    dictionaryId,
    navigationConfigId,
    index,
}) => {
    let ref = null;
    const drag = useDrag({
        item: {
            type,
        },
        begin() {
            dragStart(dictionaryId);
        },
        end() {
            // TODO: investigate why when not dropped on a drop target this takes extra time to respond
            // see issue: https://github.com/microsoft/fast/issues/2867
            dragEnd();
        },
    });
    const dragSource = drag[1];
    const drop = useDrop({
        accept: [DragDropItemType.linkedData],
        hover(item, monitor) {
            const dragItemOffsetY = monitor.getClientOffset().y;
            const dropItemBoundingClientRect = ref.getBoundingClientRect();
            let hoverLocation = HoverLocation.before;
            if (
                dropItemBoundingClientRect.y + dropItemBoundingClientRect.height / 2 <
                dragItemOffsetY
            ) {
                hoverLocation = HoverLocation.after;
            }
            dragHover(type, dictionaryId, navigationConfigId, index, hoverLocation);
        },
    });
    const dropTarget = drop[1];
    function refNode(node) {
        switch (type) {
            case DragDropItemType.linkedData:
                return dragSource(dropTarget(node));
            case DragDropItemType.linkedDataContainer:
            case DragDropItemType.default:
                return dropTarget(node);
        }
    }
    return treeItem(
        handleClick,
        handleInputChange,
        handleInputBlur,
        handleInputKeyDown,
        handleExpandClick,
        handleKeyDown,
        isEditable,
        isCollapsible,
        className,
        expandTriggerClassName,
        contentClassName,
        displayTextInputClassName,
        text,
        dictionaryId,
        navigationConfigId,
        node => {
            ref = node;
            return refNode(node);
        }
    );
};
