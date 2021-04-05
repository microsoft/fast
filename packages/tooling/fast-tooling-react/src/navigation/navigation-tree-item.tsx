import React from "react";
import { DragDropItemType, NavigationTreeItemProps } from "./navigation-tree-item.props";
import {
    ConnectDragSource,
    ConnectDropTarget,
    DragElementWrapper,
    DragObjectWithType,
    DragPreviewOptions,
    DragSourceOptions,
    DropTargetMonitor,
    useDrag,
    useDrop,
} from "react-dnd";
import { HoverLocation } from "./navigation.props";

function editableOverlay(
    className: string,
    value: string,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void,
    handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
): React.ReactNode {
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
    handleClick: React.MouseEventHandler<HTMLElement>,
    handleInputChange: React.ChangeEventHandler<HTMLInputElement>,
    handleInputBlur: React.FocusEventHandler<HTMLInputElement>,
    handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement>,
    handleExpandClick: React.MouseEventHandler<HTMLElement>,
    handleKeyDown: React.KeyboardEventHandler<HTMLElement>,
    isEditable: boolean,
    isCollapsible: boolean,
    className: string,
    expandTriggerClassName: string,
    contentClassName: string,
    displayTextInputClassName: string,
    text: string,
    dictionaryId: string,
    navigationConfigId: string,
    ref?: (node: HTMLAnchorElement) => React.ReactElement<any>
): React.ReactElement {
    const displayText: React.ReactNode = isEditable
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
    handleClick: React.MouseEventHandler<HTMLElement>,
    handleKeyDown: React.KeyboardEventHandler<HTMLElement>,
    contentClassName: string,
    text: string,
    dictionaryId: string,
    navigationConfigId: string,
    ref?: (node: HTMLAnchorElement) => React.ReactElement<any>
): React.ReactElement {
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
    handleClick: React.MouseEventHandler<HTMLElement>,
    handleKeyDown: React.KeyboardEventHandler<HTMLElement>,
    contentClassName: string,
    text: string,
    dictionaryId: string,
    navigationConfigId: string,
    ref?: (node: HTMLSpanElement) => React.ReactElement<any>
): React.ReactElement {
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

export const NavigationTreeItem: React.FC<NavigationTreeItemProps> = ({
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
}: React.PropsWithChildren<NavigationTreeItemProps>): React.ReactElement => {
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

export const DraggableNavigationTreeItem: React.FC<NavigationTreeItemProps> = ({
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
}: React.PropsWithChildren<NavigationTreeItemProps>): React.ReactElement => {
    let ref: HTMLAnchorElement | HTMLSpanElement | null = null;

    const drag: [
        unknown,
        DragElementWrapper<DragSourceOptions>,
        DragElementWrapper<DragPreviewOptions>
    ] = useDrag({
        item: {
            type,
        },
        begin(): void {
            dragStart(dictionaryId);
        },
        end(): void {
            // TODO: investigate why when not dropped on a drop target this takes extra time to respond
            // see issue: https://github.com/microsoft/fast/issues/2867
            dragEnd();
        },
    });
    const dragSource: ConnectDragSource = drag[1];
    const drop: [{}, DragElementWrapper<any>] = useDrop({
        accept: [DragDropItemType.linkedData],
        hover(item: DragObjectWithType, monitor: DropTargetMonitor): void {
            const dragItemOffsetY: number = monitor.getClientOffset().y;
            const dropItemBoundingClientRect: DOMRect = ref.getBoundingClientRect() as DOMRect;
            let hoverLocation: HoverLocation = HoverLocation.before;

            if (
                dropItemBoundingClientRect.y + dropItemBoundingClientRect.height / 2 <
                dragItemOffsetY
            ) {
                hoverLocation = HoverLocation.after;
            }

            dragHover(type, dictionaryId, navigationConfigId, index, hoverLocation);
        },
    });
    const dropTarget: ConnectDropTarget = drop[1];

    function refNode(node: HTMLSpanElement | HTMLAnchorElement): React.ReactElement {
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
        (node: HTMLSpanElement): React.ReactElement => {
            ref = node;
            return refNode(node);
        }
    );
};
