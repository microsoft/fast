import { ConnectDragSource, ConnectDropTarget, DropTargetMonitor } from "react-dnd";
import { DragDropItemType } from "./navigation-tree-item.props";
import { HoverLocation } from "./navigation.props";

export function refNode(
    node: HTMLSpanElement | HTMLAnchorElement,
    type: DragDropItemType,
    dragSource: ConnectDragSource,
    dropTarget: ConnectDropTarget
): React.ReactElement {
    switch (type) {
        case DragDropItemType.linkedData:
        case DragDropItemType.linkedDataUndroppable:
            return dragSource(dropTarget(node)); // this source can be dragged and dropped
        case DragDropItemType.linkedDataContainer:
        case DragDropItemType.rootLinkedData:
            return dropTarget(node); // this source can be dropped on but not dragged
        case DragDropItemType.undraggableUndroppable:
        case DragDropItemType.rootLinkedDataUndroppable:
            return;
    }
}

export function getHoverLocation(
    type: DragDropItemType,
    monitor: DropTargetMonitor,
    cachedRefBoundingClientRect: DOMRect
): HoverLocation {
    const dragItemOffsetY: number = monitor.getClientOffset().y;
    let hoverLocation: HoverLocation = HoverLocation.center;

    if (type === DragDropItemType.linkedDataUndroppable) {
        /**
         * For linked data that cannot be dropped on, it should halve the clientRect so
         * items can be dropped before and after but not on the linked data
         */

        if (
            cachedRefBoundingClientRect.y + cachedRefBoundingClientRect.height / 2 <
            dragItemOffsetY
        ) {
            hoverLocation = HoverLocation.after;
        } else {
            hoverLocation = HoverLocation.before;
        }
    } else if (type === DragDropItemType.linkedData) {
        /**
         * For linked data that can be dropped on, divide the height of the clientRect into thirds,
         * if its the top third the item should be placed before the hovered item, if it is the
         * bottom third it should be placed after
         */
        const thirdOfTheDropedItemBoundingClientRect =
            cachedRefBoundingClientRect.height / 3;

        if (
            cachedRefBoundingClientRect.y + thirdOfTheDropedItemBoundingClientRect * 2 <
            dragItemOffsetY
        ) {
            hoverLocation = HoverLocation.after;
        } else if (
            cachedRefBoundingClientRect.y + thirdOfTheDropedItemBoundingClientRect >
            dragItemOffsetY
        ) {
            hoverLocation = HoverLocation.before;
        }
    }

    return hoverLocation;
}
