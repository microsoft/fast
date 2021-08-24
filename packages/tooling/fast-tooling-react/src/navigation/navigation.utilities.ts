import {
    Data,
    DataDictionary,
    getLinkedData,
    LinkedData,
    MessageSystemDataTypeAction,
    MessageSystemIncoming,
    MessageSystemType,
    NavigationConfigDictionary,
} from "@microsoft/fast-tooling";
import { XOR } from "@microsoft/fast-tooling/dist/dts/data-utilities/type.utilities";
import {
    HoveredItem,
    HoverLocation,
    LinkedDataLocationConfig,
    NavigationState,
} from "./navigation.props";
import { DragDropItemType } from "./navigation-tree-item.props";

export function getDraggableItemClassName(
    isCollapsible: boolean,
    isDraggable: boolean,
    isDroppable: boolean,
    dictionaryId: string,
    navigationConfigId: string,
    hoveredItem: any,
    activeDictionaryId: string,
    activeNavigationConfigId: string,
    defaultLinkedDataDroppableDataLocation: string,
    navigationItem: string,
    navigationItemExpandable: string,
    navigationItemActive: string,
    navigationItemDraggable: string,
    navigationItemDroppable: string,
    navigationItemHover: string,
    navigationItemHoverAfter: string,
    navigationItemHoverBefore: string
): string {
    let className: string = navigationItem;

    if (isCollapsible) {
        className += ` ${navigationItemExpandable}`;
    }

    if (
        activeDictionaryId === dictionaryId &&
        activeNavigationConfigId === navigationConfigId
    ) {
        className += ` ${navigationItemActive}`;
    }

    if (isDraggable) {
        className += ` ${navigationItemDraggable}`;
    }

    if (isDroppable) {
        className += ` ${navigationItemDroppable}`;
    }

    if (
        hoveredItem !== null &&
        hoveredItem[1] === dictionaryId &&
        hoveredItem[2] === navigationConfigId
    ) {
        if (
            hoveredItem[0] === DragDropItemType.linkedDataContainer ||
            ((hoveredItem[0] === DragDropItemType.linkedData ||
                hoveredItem[0] === DragDropItemType.rootLinkedData) &&
                defaultLinkedDataDroppableDataLocation &&
                hoveredItem[3] === HoverLocation.center)
        ) {
            className += ` ${navigationItemHover}`;
        } else if (
            hoveredItem[0] === DragDropItemType.linkedData ||
            hoveredItem[0] === DragDropItemType.linkedDataUndroppable
        ) {
            if (hoveredItem[3] === HoverLocation.after) {
                className += ` ${navigationItemHoverAfter}`;
            } else {
                className += ` ${navigationItemHoverBefore}`;
            }
        }
    }

    return className;
}

export function getDragStartState(
    dictionaryId: string,
    index: number,
    dataDictionary: DataDictionary<unknown>,
    navigationDictionary: NavigationConfigDictionary
): Pick<NavigationState, "linkedData" | "linkedDataLocation"> {
    return {
        linkedData: getLinkedData(dataDictionary, [dictionaryId]),
        linkedDataLocation: [
            navigationDictionary[0][dictionaryId][0][
                navigationDictionary[0][dictionaryId][1]
            ].parentDictionaryItem.id,
            navigationDictionary[0][dictionaryId][0][
                navigationDictionary[0][dictionaryId][1]
            ].parentDictionaryItem.dataLocation,
            index,
        ],
    };
}

export function getDragStartMessage(
    dictionaryId: string,
    navigationId: string,
    navigationDictionary: NavigationConfigDictionary
): MessageSystemIncoming {
    return {
        type: MessageSystemType.data,
        action: MessageSystemDataTypeAction.removeLinkedData,
        dictionaryId:
            navigationDictionary[0][dictionaryId][0][
                navigationDictionary[0][dictionaryId][1]
            ].parentDictionaryItem.id,
        dataLocation:
            navigationDictionary[0][dictionaryId][0][
                navigationDictionary[0][dictionaryId][1]
            ].parentDictionaryItem.dataLocation,
        linkedData: navigationDictionary[0][
            navigationDictionary[0][dictionaryId][0][
                navigationDictionary[0][dictionaryId][1]
            ].parentDictionaryItem.id
        ][0][
            navigationDictionary[0][dictionaryId][0][
                navigationDictionary[0][dictionaryId][1]
            ].parentDictionaryItem.dataLocation
        ].data.filter((value: LinkedData) => {
            return value.id === dictionaryId;
        }),
        options: {
            originatorId: navigationId,
        },
    };
}

export function getDragEndMessage(
    navigationId: string,
    hoveredItem: HoveredItem,
    linkedData: Data<unknown>[],
    linkedDataLocation: LinkedDataLocationConfig,
    defaultLinkedDataDroppableDataLocation: XOR<string, undefined>
): MessageSystemIncoming {
    if (hoveredItem === null) {
        return {
            type: MessageSystemType.data,
            action: MessageSystemDataTypeAction.addLinkedData,
            linkedData,
            dictionaryId: linkedDataLocation[0],
            dataLocation: linkedDataLocation[1],
            index: linkedDataLocation[2],
            options: {
                originatorId: navigationId,
            },
        };
    }

    const dropOntoLinkedData: boolean =
        (linkedDataLocation[1] === "" ||
            linkedDataLocation[1] === defaultLinkedDataDroppableDataLocation) &&
        defaultLinkedDataDroppableDataLocation &&
        hoveredItem[3] === HoverLocation.center;

    return {
        type: MessageSystemType.data,
        action: MessageSystemDataTypeAction.addLinkedData,
        linkedData: linkedData,
        dictionaryId: linkedDataLocation[0],
        dataLocation: dropOntoLinkedData
            ? defaultLinkedDataDroppableDataLocation
            : linkedDataLocation[1],
        index: dropOntoLinkedData ? void 0 : linkedDataLocation[2],
        options: {
            originatorId: navigationId,
        },
    };
}

export function getDragHoverState(
    dictionaryId: string,
    navigationConfigId: string,
    type: DragDropItemType,
    location: HoverLocation,
    index: number,
    hoveredItem: HoveredItem,
    navigationDictionary: NavigationConfigDictionary,
    defaultLinkedDataDroppableDataLocation: XOR<string, undefined>
): Pick<NavigationState, "hoveredItem" | "linkedDataLocation"> {
    let parentDictionaryId: string = dictionaryId;
    let parentDataLocation: string =
        navigationDictionary[0][dictionaryId][0][navigationConfigId].relativeDataLocation;
    const isLinkedDataContainer: boolean = type === DragDropItemType.linkedDataContainer;
    const isDroppableLinkedData: boolean =
        type === DragDropItemType.linkedData || type === DragDropItemType.rootLinkedData;

    if (
        isDroppableLinkedData &&
        defaultLinkedDataDroppableDataLocation &&
        location === HoverLocation.center
    ) {
        parentDataLocation = defaultLinkedDataDroppableDataLocation;
    } else if (
        !isLinkedDataContainer &&
        navigationDictionary[0][dictionaryId][0][navigationConfigId]
            .parentDictionaryItem !== undefined
    ) {
        parentDataLocation =
            navigationDictionary[0][dictionaryId][0][navigationConfigId]
                .parentDictionaryItem.dataLocation;
        parentDictionaryId =
            navigationDictionary[0][dictionaryId][0][navigationConfigId]
                .parentDictionaryItem.id;
    }

    if (
        hoveredItem === null ||
        dictionaryId !== hoveredItem[1] ||
        navigationConfigId !== hoveredItem[2] ||
        location !== hoveredItem[3]
    ) {
        return {
            hoveredItem: [type, dictionaryId, navigationConfigId, location],
            linkedDataLocation: [
                parentDictionaryId,
                parentDataLocation,
                isLinkedDataContainer
                    ? undefined
                    : location === HoverLocation.before
                    ? index
                    : index + 1,
            ],
        };
    }

    return;
}
