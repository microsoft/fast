import "../__tests__/mocks/match-media";
import { DragDropItemType } from "./navigation-tree-item.props";
import { getHoverLocation, refNode } from "./navigation-tree-item.utilities";
import { HoverLocation } from "./navigation.props";

describe("getHoverLocation", () => {
    describe("when the type is linked-data", () => {
        test("should get the hover location before the hovered item", () => {
            expect(
                getHoverLocation(
                    DragDropItemType.linkedData,
                    {
                        getClientOffset: () => {
                            return {
                                y: 10,
                            };
                        },
                    } as any,
                    {
                        height: 36,
                        y: 0,
                    } as any
                )
            ).toEqual(HoverLocation.before);
        });
        test("should get the hover location after the hovered item", () => {
            expect(
                getHoverLocation(
                    DragDropItemType.linkedData,
                    {
                        getClientOffset: () => {
                            return {
                                y: 34,
                            };
                        },
                    } as any,
                    {
                        height: 36,
                        y: 0,
                    } as any
                )
            ).toEqual(HoverLocation.after);
        });
        test("should get the hovered location in the center of the hovered item", () => {
            expect(
                getHoverLocation(
                    DragDropItemType.linkedData,
                    {
                        getClientOffset: () => {
                            return {
                                y: 15,
                            };
                        },
                    } as any,
                    {
                        height: 36,
                        y: 0,
                    } as any
                )
            ).toEqual(HoverLocation.center);
        });
    });
    describe("when the type is linked-data-undroppable", () => {
        test("should get the hover location before the hovered item", () => {
            expect(
                getHoverLocation(
                    DragDropItemType.linkedDataUndroppable,
                    {
                        getClientOffset: () => {
                            return {
                                y: 10,
                            };
                        },
                    } as any,
                    {
                        height: 36,
                        y: 0,
                    } as any
                )
            ).toEqual(HoverLocation.before);
        });
        test("should get the hover location after the hovered item", () => {
            expect(
                getHoverLocation(
                    DragDropItemType.linkedDataUndroppable,
                    {
                        getClientOffset: () => {
                            return {
                                y: 19,
                            };
                        },
                    } as any,
                    {
                        height: 36,
                        y: 0,
                    } as any
                )
            ).toEqual(HoverLocation.after);
        });
    });
    describe("when the type is root-linked-data", () => {
        test("should get the hovered location in the center of the hovered item", () => {
            expect(
                getHoverLocation(
                    DragDropItemType.rootLinkedData,
                    {
                        getClientOffset: () => {
                            return {
                                y: 19,
                            };
                        },
                    } as any,
                    {
                        height: 36,
                        y: 0,
                    } as any
                )
            ).toEqual(HoverLocation.center);
        });
    });
    describe("when the type is linked-data-container", () => {
        test("should get the hovered location in the center of the hovered item", () => {
            expect(
                getHoverLocation(
                    DragDropItemType.linkedDataContainer,
                    {
                        getClientOffset: () => {
                            return {
                                y: 19,
                            };
                        },
                    } as any,
                    {
                        height: 36,
                        y: 0,
                    } as any
                )
            ).toEqual(HoverLocation.center);
        });
    });
});

describe("refNode", () => {
    test("should return a draggable & droppable React.Element when a item type is linkedData", () => {
        function dragSource(dropTarget: any): any {
            const wrapper = document.createElement("div");
            wrapper.appendChild(dropTarget);

            return wrapper;
        }
        function dropTarget(node: any): any {
            return node;
        }
        const ref = refNode(
            document.createElement("span"),
            DragDropItemType.linkedData,
            dragSource,
            dropTarget
        );
        expect(ref instanceof HTMLDivElement).toEqual(true);
        expect((ref as any).querySelector("span")).not.toEqual(null);
    });
    test("should return a draggable & droppable React.Element when a item type is linkedDataUndroppable", () => {
        function dragSource(dropTarget: any): any {
            const wrapper = document.createElement("div");
            wrapper.appendChild(dropTarget);

            return wrapper;
        }
        function dropTarget(node: any): any {
            return node;
        }
        const ref = refNode(
            document.createElement("span"),
            DragDropItemType.linkedDataUndroppable,
            dragSource,
            dropTarget
        );
        expect(ref instanceof HTMLDivElement).toEqual(true);
        expect((ref as any).querySelector("span")).not.toEqual(null);
    });
    test("should return an droppable but undraggable React.Element when a item type is rootLinkedData", () => {
        function dragSource(dropTarget: any): any {
            const wrapper = document.createElement("div");
            wrapper.appendChild(dropTarget);

            return wrapper;
        }
        function dropTarget(node: any): any {
            return node;
        }
        const ref = refNode(
            document.createElement("span"),
            DragDropItemType.rootLinkedData,
            dragSource,
            dropTarget
        );
        expect(ref instanceof HTMLSpanElement).toEqual(true);
    });
    test("should return an droppable but undraggable React.Element when a item type is linkedDataContainer", () => {
        function dragSource(dropTarget: any): any {
            const wrapper = document.createElement("div");
            wrapper.appendChild(dropTarget);

            return wrapper;
        }
        function dropTarget(node: any): any {
            return node;
        }
        const ref = refNode(
            document.createElement("span"),
            DragDropItemType.linkedDataContainer,
            dragSource,
            dropTarget
        );
        expect(ref instanceof HTMLSpanElement).toEqual(true);
    });
    test("should return an undraggable & undroppable React.Element when a item type is undraggableUndroppable", () => {
        function dragSource(dropTarget: any): any {
            const wrapper = document.createElement("div");
            wrapper.appendChild(dropTarget);

            return wrapper;
        }
        function dropTarget(node: any): any {
            return node;
        }
        const ref = refNode(
            document.createElement("span"),
            DragDropItemType.undraggableUndroppable,
            dragSource,
            dropTarget
        );
        expect(ref).toEqual(void 0);
    });
    test("should return an undraggable & undroppable React.Element when a item type is rootLinkedDataUndroppable", () => {
        function dragSource(dropTarget: any): any {
            const wrapper = document.createElement("div");
            wrapper.appendChild(dropTarget);

            return wrapper;
        }
        function dropTarget(node: any): any {
            return node;
        }
        const ref = refNode(
            document.createElement("span"),
            DragDropItemType.rootLinkedDataUndroppable,
            dragSource,
            dropTarget
        );
        expect(ref).toEqual(void 0);
    });
});
