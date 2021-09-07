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
import { getHoverLocation, refNode } from "./navigation-tree-item.utilities";

function editableOverlay(
    className: string,
    value: string,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void,
    handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    inputRef: React.RefObject<HTMLInputElement>
): React.ReactNode {
    return (
        <input
            className={className}
            ref={inputRef}
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
    isEditing: boolean,
    isCollapsible: boolean,
    className: string,
    expandTriggerClassName: string,
    contentClassName: string,
    displayTextInputClassName: string,
    text: string,
    dictionaryId: string,
    navigationConfigId: string,
    inputRef: React.RefObject<HTMLInputElement>,
    ref?: (node: HTMLAnchorElement) => React.ReactElement<any>
): React.ReactElement {
    const displayText: React.ReactNode = isEditing
        ? editableOverlay(
              displayTextInputClassName,
              text,
              handleInputChange,
              handleInputBlur,
              handleInputKeyDown,
              inputRef
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
    isEditing,
    isCollapsible,
    handleClick,
    handleInputChange,
    handleInputBlur,
    handleInputKeyDown,
    handleExpandClick,
    handleKeyDown,
    dictionaryId,
    navigationConfigId,
    inputRef,
}: React.PropsWithChildren<NavigationTreeItemProps>): React.ReactElement => {
    return treeItem(
        handleClick,
        handleInputChange,
        handleInputBlur,
        handleInputKeyDown,
        handleExpandClick,
        handleKeyDown,
        isEditing,
        isCollapsible,
        className,
        expandTriggerClassName,
        contentClassName,
        displayTextInputClassName,
        text,
        dictionaryId,
        navigationConfigId,
        inputRef
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
    isEditing,
    inputRef,
    dragStart,
    dragEnd,
    dragHover,
    dictionaryId,
    navigationConfigId,
    index,
}: React.PropsWithChildren<NavigationTreeItemProps>): React.ReactElement => {
    let ref: HTMLAnchorElement | HTMLSpanElement | null = null;
    let cachedRef: HTMLAnchorElement | HTMLSpanElement | null = null;
    let cachedRefBoundingClientRect: DOMRect;

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
            /**
             * When the hovered element changes, reset the cached ref and
             * the cached bounding client rect to reduce performance cost
             */
            if (cachedRef !== ref) {
                cachedRef = ref;

                cachedRefBoundingClientRect = ref.getBoundingClientRect() as DOMRect;
            }

            dragHover(
                type,
                dictionaryId,
                navigationConfigId,
                index,
                getHoverLocation(type, monitor, cachedRefBoundingClientRect)
            );
        },
    });
    const dropTarget: ConnectDropTarget = drop[1];

    return treeItem(
        handleClick,
        handleInputChange,
        handleInputBlur,
        handleInputKeyDown,
        handleExpandClick,
        handleKeyDown,
        isEditing,
        isCollapsible,
        className,
        expandTriggerClassName,
        contentClassName,
        displayTextInputClassName,
        text,
        dictionaryId,
        navigationConfigId,
        inputRef,
        (node: HTMLSpanElement): React.ReactElement => {
            ref = node;
            return refNode(node, type, dragSource, dropTarget);
        }
    );
};
