import React, { useImperativeHandle, useRef } from "react";
import { XYCoord } from "dnd-core";
import { NavigationDataType, TreeNavigation } from "./navigation.props";
import {
    NavigationTreeItemDragObject,
    NavigationTreeItemDragSourceCollectedProps,
    NavigationTreeItemDropTargetCollectedProps,
    NavigationTreeItemProps,
    VerticalDragDirection,
} from "./navigation-tree-item.props";
import {
    DragSource,
    DragSourceCollector,
    DragSourceConnector,
    DragSourceMonitor,
    DragSourceSpec,
    DropTarget,
    DropTargetCollector,
    DropTargetConnector,
    DropTargetHookSpec,
    DropTargetMonitor,
    DropTargetSpec,
} from "react-dnd";

export const NavigationTreeItemDragId: symbol = Symbol();

export const navigationTreeItemDragSource: DragSourceSpec<
    NavigationTreeItemProps,
    NavigationTreeItemDragObject
> = {
    beginDrag: (props: NavigationTreeItemProps): NavigationTreeItemDragObject => {
        if (props.type === NavigationDataType.component) {
            props.handleCloseDraggingItem(props.dataLocation, props.type);
        }

        return {
            dataLocation: props.dataLocation,
        };
    },
    endDrag: (props: NavigationTreeItemProps): void => {
        props.onDragHover(null);
    },
};

export const navigationTreeItemDropSource: DropTargetSpec<NavigationTreeItemProps> = {
    drop: (
        props: NavigationTreeItemProps,
        monitor: DropTargetMonitor,
        component: any
    ): void => {
        if (monitor.didDrop()) {
            return;
        }

        const item: any = monitor.getItem();

        if (props.dataLocation === item.dataLocation) {
            return;
        }

        if (
            props.type === NavigationDataType.children ||
            props.type === NavigationDataType.component ||
            (props.type === NavigationDataType.primitiveChild &&
                (props.dragHoverAfter || props.dragHoverBefore))
        ) {
            const verticalDirection: VerticalDragDirection = props.dragHoverAfter
                ? VerticalDragDirection.down
                : props.dragHoverBefore
                    ? VerticalDragDirection.up
                    : VerticalDragDirection.center;

            component.props.onChange(
                item.dataLocation,
                props.dataLocation,
                props.type,
                verticalDirection
            );
        }
    },
    hover: (
        props: NavigationTreeItemProps,
        monitor: DropTargetMonitor,
        component: any
    ): void => {
        if (
            monitor.isOver({ shallow: true }) &&
            props.type === NavigationDataType.children
        ) {
            props.onDragHover(props.dataLocation);
        } else if (
            monitor.isOver({ shallow: true }) &&
            (props.type === NavigationDataType.component ||
                props.type === NavigationDataType.primitiveChild)
        ) {
            if (!component) {
                return null;
            }

            const node: HTMLDivElement = component.getNode();

            if (!node) {
                return null;
            }

            const hoverBoundingRect: ClientRect | DOMRect = node.getBoundingClientRect();
            const hoverMiddleY: number =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2; // vertical centerline
            const clientOffset: XYCoord | null = monitor.getClientOffset(); // mouse position
            const hoverClientY: number = clientOffset.y - hoverBoundingRect.top; // pixels from the top
            const verticalOffset: number = hoverBoundingRect.height / 4;
            const direction: VerticalDragDirection =
                hoverClientY < hoverMiddleY - verticalOffset
                    ? VerticalDragDirection.up
                    : hoverClientY > hoverMiddleY + verticalOffset
                        ? VerticalDragDirection.down
                        : VerticalDragDirection.center;

            props.onDragHover(props.dataLocation, direction);
        }
    },
};

const navigationTreeItemDragSourceCollect: DragSourceCollector<
    Required<NavigationTreeItemDragSourceCollectedProps>,
    NavigationTreeItemProps
> = (
    connect: DragSourceConnector,
    monitor: DragSourceMonitor
): Required<NavigationTreeItemDragSourceCollectedProps> => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    };
};

const navigationTreeItemDropTargetCollect: DropTargetCollector<
    Required<NavigationTreeItemDropTargetCollectedProps>,
    NavigationTreeItemProps
> = (
    connect: DropTargetConnector,
    monitor: DropTargetMonitor
): Required<NavigationTreeItemDropTargetCollectedProps> => {
    return {
        connectDropTarget: connect.dropTarget(),
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
    };
};

interface NavigationTreeItemInstance {
    getNode(): HTMLSpanElement | null;
}

const NavigationTreeItem: React.RefForwardingComponent<
    HTMLSpanElement,
    NavigationTreeItemProps
> = React.forwardRef(
    (props: NavigationTreeItemProps, ref: React.RefObject<HTMLDivElement>) => {
        const elementRef: any = useRef(null);
        const dragDirection: VerticalDragDirection | void = props.dragHoverBefore
            ? VerticalDragDirection.up
            : props.dragHoverAfter
                ? VerticalDragDirection.down
                : VerticalDragDirection.center;

        function getDragHoverClassName(): string {
            return props.dragHover && props.canDrop && props.isOver
                ? ` ${props.getContentDragHoverClassName(
                      props.type,
                      typeof dragDirection !== "undefined" ? dragDirection : void 0
                  )}`
                : "";
        }

        useImperativeHandle<{}, NavigationTreeItemInstance>(
            ref,
            (): NavigationTreeItemInstance => ({
                getNode: (): HTMLDivElement => elementRef.current,
            })
        );

        const item: JSX.Element =
            props.children !== undefined ? (
                <div
                    className={props.className(props.isDragging)}
                    role={"treeitem"}
                    ref={elementRef}
                    aria-expanded={props.expanded}
                    onKeyDown={props.handleKeyDown}
                >
                    <span
                        className={`${props.contentClassName}${getDragHoverClassName()}`}
                        onClick={props.handleSelectionClick}
                        onKeyDown={props.handleKeyDown}
                        tabIndex={0}
                        data-location={props.dataLocation}
                    >
                        <button
                            className={props.expandTriggerClassName}
                            onClick={props.handleClick}
                        />
                        {props.text}
                    </span>
                    {props.children}
                </div>
            ) : (
                <div className={props.className(props.isDragging)} ref={elementRef}>
                    <a
                        className={`${props.contentClassName}${getDragHoverClassName()}`}
                        role={"treeitem"}
                        data-location={props.dataLocation}
                        href={"#"}
                        onClick={props.handleClick}
                        onKeyDown={props.handleKeyDown}
                        tabIndex={0}
                    >
                        {props.text}
                    </a>
                </div>
            );

        const canDragAndDrop: boolean =
            typeof props.connectDropTarget === "function" &&
            typeof props.connectDragSource === "function";

        return canDragAndDrop &&
            (props.type === NavigationDataType.component ||
                props.type === NavigationDataType.primitiveChild)
            ? props.connectDragSource(props.connectDropTarget(item))
            : canDragAndDrop && props.type === NavigationDataType.children
                ? props.connectDropTarget(item)
                : item;
    }
);

export { NavigationTreeItem };

/*
 * The type returned by DropTarget is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
export const DraggableNavigationTreeItem = DropTarget(
    NavigationTreeItemDragId,
    navigationTreeItemDropSource,
    navigationTreeItemDropTargetCollect
)(
    DragSource(
        NavigationTreeItemDragId,
        navigationTreeItemDragSource,
        navigationTreeItemDragSourceCollect
    )(NavigationTreeItem)
);
type DraggableNavigationTreeItem = InstanceType<typeof DraggableNavigationTreeItem>;
