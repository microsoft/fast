import "../__tests__/mocks/match-media";
import {
    MessageSystemDataTypeAction,
    MessageSystemType,
    NavigationConfigDictionary,
} from "@microsoft/fast-tooling";
import { DragDropItemType } from "./navigation-tree-item.props";
import { HoverLocation } from "./navigation.props";
import {
    getDragEndMessage,
    getDraggableItemClassName,
    getDragHoverState,
    getDragStartMessage,
    getDragStartState,
} from "./navigation.utilities";

const defaultClassNameArgs: { [key: string]: any } = {
    isCollapsible: false,
    isDraggable: false,
    isDroppable: false,
    dictionaryId: "foo",
    navigationConfigId: "bar",
    hoveredItem: null,
    activeDictionaryId: "bat",
    activeNavigationConfigId: "baz",
    defaultLinkedDataDroppableDataLocation: "",
    navigationItem: "navigationItem",
    navigationItemExpandable: "navigationItemExpandable",
    navigationItemActive: "navigationItemActive",
    navigationItemDraggable: "navigationItemDraggable",
    navigationItemDroppable: "navigationItemDroppable",
    navigationItemHover: "navigationItemHover",
    navigationItemHoverAfter: "navigationItemHoverAfter",
    navigationItemHoverBefore: "navigationItemHoverBefore",
};

/**
 * Gets class names for navigation items
 */
describe("getDraggableItemClassName", () => {
    test("should return only the base class name", () => {
        expect(
            getDraggableItemClassName(
                defaultClassNameArgs.isCollapsible,
                defaultClassNameArgs.isDraggable,
                defaultClassNameArgs.isDroppable,
                defaultClassNameArgs.dictionaryId,
                defaultClassNameArgs.navigationConfigId,
                defaultClassNameArgs.hoveredItem,
                defaultClassNameArgs.activeDictionaryId,
                defaultClassNameArgs.activeNavigationConfigId,
                defaultClassNameArgs.defaultLinkedDataDroppableDataLocation,
                defaultClassNameArgs.navigationItem,
                defaultClassNameArgs.navigationItemExpandable,
                defaultClassNameArgs.navigationItemActive,
                defaultClassNameArgs.navigationItemDraggable,
                defaultClassNameArgs.navigationItemDroppable,
                defaultClassNameArgs.navigationItemHover,
                defaultClassNameArgs.navigationItemHoverAfter,
                defaultClassNameArgs.navigationItemHoverBefore
            )
        ).toEqual(defaultClassNameArgs.navigationItem);
    });
    test("should return the class names for a collapsible node", () => {
        expect(
            getDraggableItemClassName(
                true,
                defaultClassNameArgs.isDraggable,
                defaultClassNameArgs.isDroppable,
                defaultClassNameArgs.dictionaryId,
                defaultClassNameArgs.navigationConfigId,
                defaultClassNameArgs.hoveredItem,
                defaultClassNameArgs.activeDictionaryId,
                defaultClassNameArgs.activeNavigationConfigId,
                defaultClassNameArgs.defaultLinkedDataDroppableDataLocation,
                defaultClassNameArgs.navigationItem,
                defaultClassNameArgs.navigationItemExpandable,
                defaultClassNameArgs.navigationItemActive,
                defaultClassNameArgs.navigationItemDraggable,
                defaultClassNameArgs.navigationItemDroppable,
                defaultClassNameArgs.navigationItemHover,
                defaultClassNameArgs.navigationItemHoverAfter,
                defaultClassNameArgs.navigationItemHoverBefore
            )
        ).toEqual(
            `${defaultClassNameArgs.navigationItem} ${defaultClassNameArgs.navigationItemExpandable}`
        );
    });
    test("should return the class names for a draggable node", () => {
        expect(
            getDraggableItemClassName(
                defaultClassNameArgs.isCollapsible,
                true,
                defaultClassNameArgs.isDroppable,
                defaultClassNameArgs.dictionaryId,
                defaultClassNameArgs.navigationConfigId,
                defaultClassNameArgs.hoveredItem,
                defaultClassNameArgs.activeDictionaryId,
                defaultClassNameArgs.activeNavigationConfigId,
                defaultClassNameArgs.defaultLinkedDataDroppableDataLocation,
                defaultClassNameArgs.navigationItem,
                defaultClassNameArgs.navigationItemExpandable,
                defaultClassNameArgs.navigationItemActive,
                defaultClassNameArgs.navigationItemDraggable,
                defaultClassNameArgs.navigationItemDroppable,
                defaultClassNameArgs.navigationItemHover,
                defaultClassNameArgs.navigationItemHoverAfter,
                defaultClassNameArgs.navigationItemHoverBefore
            )
        ).toEqual(
            `${defaultClassNameArgs.navigationItem} ${defaultClassNameArgs.navigationItemDraggable}`
        );
    });
    test("should return the class names for a droppable node", () => {
        expect(
            getDraggableItemClassName(
                defaultClassNameArgs.isCollapsible,
                defaultClassNameArgs.isDraggable,
                true,
                defaultClassNameArgs.dictionaryId,
                defaultClassNameArgs.navigationConfigId,
                defaultClassNameArgs.hoveredItem,
                defaultClassNameArgs.activeDictionaryId,
                defaultClassNameArgs.activeNavigationConfigId,
                defaultClassNameArgs.defaultLinkedDataDroppableDataLocation,
                defaultClassNameArgs.navigationItem,
                defaultClassNameArgs.navigationItemExpandable,
                defaultClassNameArgs.navigationItemActive,
                defaultClassNameArgs.navigationItemDraggable,
                defaultClassNameArgs.navigationItemDroppable,
                defaultClassNameArgs.navigationItemHover,
                defaultClassNameArgs.navigationItemHoverAfter,
                defaultClassNameArgs.navigationItemHoverBefore
            )
        ).toEqual(
            `${defaultClassNameArgs.navigationItem} ${defaultClassNameArgs.navigationItemDroppable}`
        );
    });
    test("should return the class names for an active node", () => {
        expect(
            getDraggableItemClassName(
                defaultClassNameArgs.isCollapsible,
                defaultClassNameArgs.isDraggable,
                defaultClassNameArgs.isDroppable,
                "",
                "foo",
                defaultClassNameArgs.hoveredItem,
                "",
                "foo",
                defaultClassNameArgs.defaultLinkedDataDroppableDataLocation,
                defaultClassNameArgs.navigationItem,
                defaultClassNameArgs.navigationItemExpandable,
                defaultClassNameArgs.navigationItemActive,
                defaultClassNameArgs.navigationItemDraggable,
                defaultClassNameArgs.navigationItemDroppable,
                defaultClassNameArgs.navigationItemHover,
                defaultClassNameArgs.navigationItemHoverAfter,
                defaultClassNameArgs.navigationItemHoverBefore
            )
        ).toEqual(
            `${defaultClassNameArgs.navigationItem} ${defaultClassNameArgs.navigationItemActive}`
        );
    });
    test("should return the class names for a hovered node if it is a container", () => {
        expect(
            getDraggableItemClassName(
                defaultClassNameArgs.isCollapsible,
                defaultClassNameArgs.isDraggable,
                defaultClassNameArgs.isDroppable,
                "foo",
                "bar",
                [
                    DragDropItemType.linkedDataContainer,
                    "foo",
                    "bar",
                    HoverLocation.center,
                ],
                defaultClassNameArgs.activeDictionaryId,
                defaultClassNameArgs.activeNavigationConfigId,
                defaultClassNameArgs.defaultLinkedDataDroppableDataLocation,
                defaultClassNameArgs.navigationItem,
                defaultClassNameArgs.navigationItemExpandable,
                defaultClassNameArgs.navigationItemActive,
                defaultClassNameArgs.navigationItemDraggable,
                defaultClassNameArgs.navigationItemDroppable,
                defaultClassNameArgs.navigationItemHover,
                defaultClassNameArgs.navigationItemHoverAfter,
                defaultClassNameArgs.navigationItemHoverBefore
            )
        ).toEqual(
            `${defaultClassNameArgs.navigationItem} ${defaultClassNameArgs.navigationItemHover}`
        );
    });
    test("should return the class names for a hovered node if it is linked data", () => {
        expect(
            getDraggableItemClassName(
                defaultClassNameArgs.isCollapsible,
                defaultClassNameArgs.isDraggable,
                defaultClassNameArgs.isDroppable,
                "foo",
                "bar",
                [DragDropItemType.linkedData, "foo", "bar", HoverLocation.center],
                defaultClassNameArgs.activeDictionaryId,
                defaultClassNameArgs.activeNavigationConfigId,
                "bat",
                defaultClassNameArgs.navigationItem,
                defaultClassNameArgs.navigationItemExpandable,
                defaultClassNameArgs.navigationItemActive,
                defaultClassNameArgs.navigationItemDraggable,
                defaultClassNameArgs.navigationItemDroppable,
                defaultClassNameArgs.navigationItemHover,
                defaultClassNameArgs.navigationItemHoverAfter,
                defaultClassNameArgs.navigationItemHoverBefore
            )
        ).toEqual(
            `${defaultClassNameArgs.navigationItem} ${defaultClassNameArgs.navigationItemHover}`
        );
    });
    test("should return the class names for a hovered node if it is root linked data", () => {
        expect(
            getDraggableItemClassName(
                defaultClassNameArgs.isCollapsible,
                defaultClassNameArgs.isDraggable,
                defaultClassNameArgs.isDroppable,
                "foo",
                "bar",
                [DragDropItemType.rootLinkedData, "foo", "bar", HoverLocation.center],
                defaultClassNameArgs.activeDictionaryId,
                defaultClassNameArgs.activeNavigationConfigId,
                "bat",
                defaultClassNameArgs.navigationItem,
                defaultClassNameArgs.navigationItemExpandable,
                defaultClassNameArgs.navigationItemActive,
                defaultClassNameArgs.navigationItemDraggable,
                defaultClassNameArgs.navigationItemDroppable,
                defaultClassNameArgs.navigationItemHover,
                defaultClassNameArgs.navigationItemHoverAfter,
                defaultClassNameArgs.navigationItemHoverBefore
            )
        ).toEqual(
            `${defaultClassNameArgs.navigationItem} ${defaultClassNameArgs.navigationItemHover}`
        );
    });
    test("should return the class names for a node when hovering before the node", () => {
        expect(
            getDraggableItemClassName(
                defaultClassNameArgs.isCollapsible,
                defaultClassNameArgs.isDraggable,
                defaultClassNameArgs.isDroppable,
                defaultClassNameArgs.dictionaryId,
                defaultClassNameArgs.navigationConfigId,
                [DragDropItemType.linkedData, "foo", "bar", HoverLocation.before],
                defaultClassNameArgs.activeDictionaryId,
                defaultClassNameArgs.activeNavigationConfigId,
                defaultClassNameArgs.defaultLinkedDataDroppableDataLocation,
                defaultClassNameArgs.navigationItem,
                defaultClassNameArgs.navigationItemExpandable,
                defaultClassNameArgs.navigationItemActive,
                defaultClassNameArgs.navigationItemDraggable,
                defaultClassNameArgs.navigationItemDroppable,
                defaultClassNameArgs.navigationItemHover,
                defaultClassNameArgs.navigationItemHoverAfter,
                defaultClassNameArgs.navigationItemHoverBefore
            )
        ).toEqual(
            `${defaultClassNameArgs.navigationItem} ${defaultClassNameArgs.navigationItemHoverBefore}`
        );
    });
    test("should return the class names for a node when hovering after the node", () => {
        expect(
            getDraggableItemClassName(
                defaultClassNameArgs.isCollapsible,
                defaultClassNameArgs.isDraggable,
                defaultClassNameArgs.isDroppable,
                defaultClassNameArgs.dictionaryId,
                defaultClassNameArgs.navigationConfigId,
                [DragDropItemType.linkedData, "foo", "bar", HoverLocation.after],
                defaultClassNameArgs.activeDictionaryId,
                defaultClassNameArgs.activeNavigationConfigId,
                defaultClassNameArgs.defaultLinkedDataDroppableDataLocation,
                defaultClassNameArgs.navigationItem,
                defaultClassNameArgs.navigationItemExpandable,
                defaultClassNameArgs.navigationItemActive,
                defaultClassNameArgs.navigationItemDraggable,
                defaultClassNameArgs.navigationItemDroppable,
                defaultClassNameArgs.navigationItemHover,
                defaultClassNameArgs.navigationItemHoverAfter,
                defaultClassNameArgs.navigationItemHoverBefore
            )
        ).toEqual(
            `${defaultClassNameArgs.navigationItem} ${defaultClassNameArgs.navigationItemHoverAfter}`
        );
    });
});

/**
 * Gets the draggable state when drag starts
 */
describe("getDragStartState", () => {
    test("should return a drag start state with linked data and linked data location", () => {
        expect(
            getDragStartState(
                "foo",
                2,
                [
                    {
                        root: {
                            schemaId: "a",
                            data: {
                                children: [
                                    {
                                        id: "foo",
                                    },
                                ],
                            },
                        },
                        foo: {
                            schemaId: "b",
                            parent: {
                                id: "root",
                                dataLocation: "children",
                            },
                            data: "Hello world",
                        },
                    },
                    "root",
                ],
                [
                    {
                        foo: [
                            {
                                "": {
                                    parentDictionaryItem: {
                                        id: "root",
                                        dataLocation: "children",
                                    },
                                } as any,
                            },
                            "",
                        ],
                    },
                    "root",
                ]
            )
        ).toEqual({
            linkedData: [
                {
                    data: "Hello world",
                    linkedData: [],
                    schemaId: "b",
                },
            ],
            linkedDataLocation: ["root", "children", 2],
        });
    });
});

/**
 * Gets the draggable message when drag starts
 */
describe("getDragStartMessage", () => {
    test("should get a message to remove linked data of the dragging linked data when drag starts", () => {
        const dictionaryId = "foo";
        const parentDictionaryId = "bat";
        const dataLocation = "foo-datalocation";
        const navigationId = "bar";
        const navigationDictionary: NavigationConfigDictionary = [
            {
                [dictionaryId]: [
                    {
                        bar: {
                            parentDictionaryItem: {
                                id: parentDictionaryId,
                                dataLocation,
                            },
                            data: "Hello world",
                        } as any,
                    },
                    "bar",
                ],
                bat: [
                    {
                        [dataLocation]: {
                            data: [
                                {
                                    id: dictionaryId,
                                },
                            ],
                        } as any,
                    },
                    "baz",
                ],
            },
            "",
        ];

        expect(
            getDragStartMessage(dictionaryId, navigationId, navigationDictionary)
        ).toEqual({
            type: MessageSystemType.data,
            action: MessageSystemDataTypeAction.removeLinkedData,
            dictionaryId: parentDictionaryId,
            dataLocation,
            linkedData: [
                {
                    id: dictionaryId,
                },
            ],
            options: {
                originatorId: navigationId,
            },
        });
    });
});

/**
 * Gets the draggable message when drag ends
 */
describe("getDragEndMessage", () => {
    test("should get a message to add linked data back where it originated if no item has been hovered when drag ends", () => {
        expect(
            getDragEndMessage(
                "",
                null,
                [
                    {
                        id: "foo",
                    } as any,
                ],
                ["a", "b", 1],
                ""
            )
        ).toEqual({
            action: "add-linked-data",
            dataLocation: "b",
            dictionaryId: "a",
            index: 1,
            linkedData: [
                {
                    id: "foo",
                },
            ],
            options: {
                originatorId: "",
            },
            type: "data",
        });
    });
    test("should get a message to add linked data to the last valid hovered item when drag ends", () => {
        expect(
            getDragEndMessage(
                "",
                [DragDropItemType.linkedData, "children", "", HoverLocation.center],
                [
                    {
                        id: "foo",
                    } as any,
                ],
                ["a", "b", 1],
                "children"
            )
        ).toEqual({
            action: "add-linked-data",
            dataLocation: "b",
            dictionaryId: "a",
            index: 1,
            linkedData: [
                {
                    id: "foo",
                },
            ],
            options: {
                originatorId: "",
            },
            type: "data",
        });
    });
});

/**
 * Gets the draggable state when drag hovers
 */
describe("getDragHoverState", () => {
    test("should get the state when hovering over the center of a valid navigation item", () => {
        const dictionaryId = "foo";
        const parentDictionaryId = "bat";
        const dataLocation = "foo-datalocation";
        const navigationConfigId = "bar";
        const defaultDataLocationForDroppedItems = "children";
        const navigationDictionary: NavigationConfigDictionary = [
            {
                [dictionaryId]: [
                    {
                        bar: {
                            parentDictionaryItem: {
                                id: parentDictionaryId,
                                dataLocation,
                            },
                            data: "Hello world",
                        } as any,
                    },
                    "bar",
                ],
                bat: [
                    {
                        [dataLocation]: {
                            data: [
                                {
                                    id: dictionaryId,
                                },
                            ],
                        } as any,
                    },
                    "baz",
                ],
            },
            "",
        ];
        expect(
            getDragHoverState(
                dictionaryId,
                navigationConfigId,
                DragDropItemType.linkedData,
                HoverLocation.center,
                0,
                [DragDropItemType.linkedData, "", "", HoverLocation.center],
                navigationDictionary,
                defaultDataLocationForDroppedItems
            )
        ).toEqual({
            hoveredItem: [
                DragDropItemType.linkedData,
                dictionaryId,
                navigationConfigId,
                HoverLocation.center,
            ],
            linkedDataLocation: [dictionaryId, defaultDataLocationForDroppedItems, 1],
        });
    });
    test("should get the state when hovering before a valid navigation item", () => {
        const dictionaryId = "foo";
        const parentDictionaryId = "bat";
        const dataLocation = "foo-datalocation";
        const navigationConfigId = "bar";
        const defaultDataLocationForDroppedItems = "children";
        const navigationDictionary: NavigationConfigDictionary = [
            {
                [dictionaryId]: [
                    {
                        bar: {
                            parentDictionaryItem: {
                                id: parentDictionaryId,
                                dataLocation,
                            },
                            data: "Hello world",
                        } as any,
                    },
                    "bar",
                ],
                bat: [
                    {
                        [dataLocation]: {
                            data: [
                                {
                                    id: dictionaryId,
                                },
                            ],
                        } as any,
                    },
                    "baz",
                ],
            },
            "",
        ];
        expect(
            getDragHoverState(
                dictionaryId,
                navigationConfigId,
                DragDropItemType.linkedData,
                HoverLocation.before,
                0,
                [DragDropItemType.linkedData, "", "", HoverLocation.before],
                navigationDictionary,
                defaultDataLocationForDroppedItems
            )
        ).toEqual({
            hoveredItem: [
                DragDropItemType.linkedData,
                dictionaryId,
                navigationConfigId,
                HoverLocation.before,
            ],
            linkedDataLocation: [parentDictionaryId, dataLocation, 0],
        });
    });
    test("should get the state when hovering after a valid navigation item", () => {
        const dictionaryId = "foo";
        const parentDictionaryId = "bat";
        const dataLocation = "foo-datalocation";
        const navigationConfigId = "bar";
        const defaultDataLocationForDroppedItems = "children";
        const navigationDictionary: NavigationConfigDictionary = [
            {
                [dictionaryId]: [
                    {
                        bar: {
                            parentDictionaryItem: {
                                id: parentDictionaryId,
                                dataLocation,
                            },
                            data: "Hello world",
                        } as any,
                    },
                    "bar",
                ],
                bat: [
                    {
                        [dataLocation]: {
                            data: [
                                {
                                    id: dictionaryId,
                                },
                            ],
                        } as any,
                    },
                    "baz",
                ],
            },
            "",
        ];
        expect(
            getDragHoverState(
                dictionaryId,
                navigationConfigId,
                DragDropItemType.linkedData,
                HoverLocation.after,
                0,
                [DragDropItemType.linkedData, "", "", HoverLocation.after],
                navigationDictionary,
                defaultDataLocationForDroppedItems
            )
        ).toEqual({
            hoveredItem: [
                DragDropItemType.linkedData,
                dictionaryId,
                navigationConfigId,
                HoverLocation.after,
            ],
            linkedDataLocation: [parentDictionaryId, dataLocation, 1],
        });
    });
});
