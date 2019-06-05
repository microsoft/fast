import "jest";
import {
    getNavigationFromData,
    getUpdatedDataWithoutSourceData,
    getUpdatedDataWithTargetData,
} from "./navigation.utilities";
import { NavigationDataType, TreeNavigation } from "./navigation.props";
import { ChildOptionItem } from "../data-utilities";

import noChildrenSchema from "../../app/configs/no-children.schema.json";
import childrenSchema from "../../app/configs/children.schema.json";
import { VerticalDragDirection } from "./navigation-tree-item.props";

const childOptions: ChildOptionItem[] = [
    {
        component: null,
        schema: noChildrenSchema,
    },
    {
        component: null,
        schema: childrenSchema,
    },
];

/**
 * Gets the navigation
 */
describe("getNavigationFromData", () => {
    test("should return a single item if no data is passed", () => {
        expect(getNavigationFromData({}, {}, [])).toEqual({
            dataLocation: "",
            items: void 0,
            text: "Undefined",
            type: NavigationDataType.object,
        });
    });
    test("should return a single item if a single string child has been passed", () => {
        const childrenText: string = "Foo";
        const data: any = {
            children: childrenText,
        };
        const navigationFromData: TreeNavigation[] | void = getNavigationFromData(
            data,
            childrenSchema,
            childOptions
        ).items;
        expect(navigationFromData).toHaveLength(1);
        expect(navigationFromData[0].items).toHaveLength(1);
        expect(navigationFromData[0].dataLocation).toEqual("children");
        expect(navigationFromData[0].text).toEqual(
            childrenSchema.reactProperties.children.title
        );
        expect(navigationFromData[0].type).toEqual(NavigationDataType.children);
        expect(navigationFromData[0].items[0].items).toEqual(void 0);
        expect(navigationFromData[0].items[0].dataLocation).toEqual("children");
        expect(navigationFromData[0].items[0].text).toEqual(childrenText);
        expect(navigationFromData[0].items[0].type).toEqual(
            NavigationDataType.childrenItem
        );
    });
    test("should return a single item if a single child has been passed", () => {
        const data: any = {
            children: {
                id: childOptions[0].schema.id,
                props: {},
            },
        };

        const navigationFromData: TreeNavigation[] | void = getNavigationFromData(
            data,
            childrenSchema,
            childOptions
        ).items;
        expect(navigationFromData).toHaveLength(1);
        expect(navigationFromData[0].items).toHaveLength(1);
        expect(navigationFromData[0].dataLocation).toEqual("children");
        expect(navigationFromData[0].text).toEqual(
            childrenSchema.reactProperties.children.title
        );
        expect(navigationFromData[0].type).toEqual(NavigationDataType.children);
        expect(navigationFromData[0].items[0].items).toEqual(void 0);
        expect(navigationFromData[0].items[0].dataLocation).toEqual("children.props");
        expect(navigationFromData[0].items[0].text).toEqual(childOptions[0].schema.title);
        expect(navigationFromData[0].items[0].type).toEqual(
            NavigationDataType.childrenItem
        );
    });
    test("should return multiple items if multiple children have been passed", () => {
        const childrenText: string = "Bar";
        const data: any = {
            children: [
                {
                    id: childOptions[0].schema.id,
                    props: {},
                },
                {
                    id: childOptions[0].schema.id,
                    props: {},
                },
                childrenText,
            ],
        };

        const navigationFromData: TreeNavigation[] | void = getNavigationFromData(
            data,
            childrenSchema,
            childOptions
        ).items;

        expect(navigationFromData).toHaveLength(1);
        expect(navigationFromData[0].text).toEqual(
            childrenSchema.reactProperties.children.title
        );
        expect(navigationFromData[0].type).toEqual(NavigationDataType.children);
        expect(navigationFromData[0].dataLocation).toEqual("children");
        expect(navigationFromData[0].items).toHaveLength(3);
        expect(navigationFromData[0].items[0].text).toEqual(childOptions[0].schema.title);
        expect(navigationFromData[0].items[0].type).toEqual(
            NavigationDataType.childrenItem
        );
        expect(navigationFromData[0].items[0].dataLocation).toEqual("children.0.props");
        expect(navigationFromData[0].items[0].items).toEqual(void 0);
        expect(navigationFromData[0].items[1].text).toEqual(childOptions[0].schema.title);
        expect(navigationFromData[0].items[1].type).toEqual(
            NavigationDataType.childrenItem
        );
        expect(navigationFromData[0].items[1].dataLocation).toEqual("children.1.props");
        expect(navigationFromData[0].items[1].items).toEqual(void 0);
        expect(navigationFromData[0].items[2].text).toEqual(childrenText);
        expect(navigationFromData[0].items[2].type).toEqual(
            NavigationDataType.childrenItem
        );
        expect(navigationFromData[0].items[2].dataLocation).toEqual("children.2");
        expect(navigationFromData[0].items[2].items).toEqual(undefined);
    });
    test("should return a nested item if nested children have been passed", () => {
        const data: any = {
            children: {
                id: childOptions[1].schema.id,
                props: {
                    children: {
                        id: childOptions[0].schema.id,
                        props: {},
                    },
                },
            },
        };

        const navigationFromData: TreeNavigation[] | void = getNavigationFromData(
            data,
            childrenSchema,
            childOptions
        ).items;
        expect(navigationFromData).toHaveLength(1);
        expect(navigationFromData[0].dataLocation).toEqual("children");
        expect(navigationFromData[0].text).toEqual(
            childrenSchema.reactProperties.children.title
        );
        expect(navigationFromData[0].type).toEqual(NavigationDataType.children);
        expect(navigationFromData[0].items).toHaveLength(1);
        expect(navigationFromData[0].items[0].dataLocation).toEqual("children.props");
        expect(navigationFromData[0].items[0].text).toEqual(childOptions[1].schema.title);
        expect(navigationFromData[0].items[0].type).toEqual(
            NavigationDataType.childrenItem
        );
        expect(navigationFromData[0].items[0].items).toHaveLength(1);
        expect(navigationFromData[0].items[0].items[0].dataLocation).toEqual(
            "children.props.children"
        );
        expect(navigationFromData[0].items[0].items[0].text).toEqual(
            childOptions[1].schema.reactProperties.children.title
        );
        expect(navigationFromData[0].items[0].items[0].type).toEqual(
            NavigationDataType.children
        );
        expect(navigationFromData[0].items[0].items[0].items).toHaveLength(1);
        expect(navigationFromData[0].items[0].items[0].items[0].dataLocation).toEqual(
            "children.props.children.props"
        );
        expect(navigationFromData[0].items[0].items[0].items[0].text).toEqual(
            childOptions[0].schema.title
        );
        expect(navigationFromData[0].items[0].items[0].items[0].type).toEqual(
            NavigationDataType.childrenItem
        );
        expect(navigationFromData[0].items[0].items[0].items[0].items).toEqual(void 0);
    });
    test("should return multiple nested items if multiple nested children have been passed", () => {
        const data: any = {
            children: {
                id: childOptions[1].schema.id,
                props: {
                    children: [
                        {
                            id: childOptions[0].schema.id,
                            props: {},
                        },
                        {
                            id: childOptions[0].schema.id,
                            props: {},
                        },
                    ],
                },
            },
        };

        const navigationFromData: TreeNavigation[] | void = getNavigationFromData(
            data,
            childrenSchema,
            childOptions
        ).items;
        expect(navigationFromData).toHaveLength(1);
        expect(navigationFromData[0].dataLocation).toEqual("children");
        expect(navigationFromData[0].text).toEqual(
            childrenSchema.reactProperties.children.title
        );
        expect(navigationFromData[0].type).toEqual(NavigationDataType.children);
        expect(navigationFromData[0].items).toHaveLength(1);
        expect(navigationFromData[0].items[0].dataLocation).toEqual("children.props");
        expect(navigationFromData[0].items[0].text).toEqual(childOptions[1].schema.title);
        expect(navigationFromData[0].items[0].type).toEqual(
            NavigationDataType.childrenItem
        );
        expect(navigationFromData[0].items[0].items).toHaveLength(1);
        expect(navigationFromData[0].items[0].items[0].dataLocation).toEqual(
            "children.props.children"
        );
        expect(navigationFromData[0].items[0].items[0].text).toEqual(
            childrenSchema.reactProperties.children.title
        );
        expect(navigationFromData[0].items[0].items[0].type).toEqual(
            NavigationDataType.children
        );
        expect(navigationFromData[0].items[0].items[0].items).toHaveLength(2);
        expect(navigationFromData[0].items[0].items[0].items[0].dataLocation).toEqual(
            "children.props.children.0.props"
        );
        expect(navigationFromData[0].items[0].items[0].items[0].text).toEqual(
            childOptions[0].schema.title
        );
        expect(navigationFromData[0].items[0].items[0].items[0].type).toEqual(
            NavigationDataType.childrenItem
        );
        expect(navigationFromData[0].items[0].items[0].items[0].items).toEqual(void 0);
        expect(navigationFromData[0].items[0].items[0].items[1].dataLocation).toEqual(
            "children.props.children.1.props"
        );
        expect(navigationFromData[0].items[0].items[0].items[1].text).toEqual(
            childOptions[0].schema.title
        );
        expect(navigationFromData[0].items[0].items[0].items[1].type).toEqual(
            NavigationDataType.childrenItem
        );
        expect(navigationFromData[0].items[0].items[0].items[1].items).toEqual(void 0);
    });
    test("should return an object if an object is passed", () => {
        const data: any = {
            testObject: {
                foo: "bar",
            },
        };

        const navigationFromData: TreeNavigation[] | void = getNavigationFromData(
            data,
            {
                title: "root title",
                type: "object",
                properties: {
                    testObject: {
                        title: "testObject title",
                        type: "object",
                        properties: {
                            foo: {
                                title: "foo title",
                                type: "string",
                            },
                        },
                    },
                },
            },
            childOptions
        ).items;

        expect(navigationFromData).toHaveLength(1);
        expect(navigationFromData[0].text).toEqual("testObject title");
        expect(navigationFromData[0].dataLocation).toEqual("testObject");
        expect(navigationFromData[0].type).toEqual(NavigationDataType.object);
        expect(navigationFromData[0].items).toEqual(void 0);
    });
    test("should return an array if an array is passed", () => {
        const data: any = ["bar"];

        const navigationFromData: TreeNavigation = getNavigationFromData(
            data,
            {
                title: "root title",
                type: "array",
                items: {
                    title: "foo title",
                    type: "string",
                },
            },
            childOptions
        );

        expect(navigationFromData.text).toEqual("root title");
        expect(navigationFromData.dataLocation).toEqual("");
        expect(navigationFromData.type).toEqual(NavigationDataType.array);
        expect(navigationFromData.items).toEqual(void 0);
    });
});

/**
 * Gets updated data by removing data from a path
 */
describe("getUpdatedDataWithoutSourceData", () => {
    test("should remove a string", () => {
        const updatedData: any = getUpdatedDataWithoutSourceData(
            {
                foo: "a",
            },
            "foo"
        );

        expect(updatedData).toEqual({});
    });
    test("should remove a children item", () => {
        const updatedData: any = getUpdatedDataWithoutSourceData(
            {
                foo: {
                    id: "a",
                    props: {},
                },
            },
            "foo"
        );

        expect(updatedData).toEqual({});
    });
    test("should remove a react children item from an array", () => {
        const updatedData: any = getUpdatedDataWithoutSourceData(
            {
                foo: [
                    {
                        id: "a",
                        props: {},
                    },
                    "b",
                ],
            },
            "foo.0.props"
        );

        expect(updatedData).toEqual({ foo: "b" });
    });
    test("should remove a string children item from an array", () => {
        const updatedData: any = getUpdatedDataWithoutSourceData(
            {
                foo: [
                    {
                        id: "a",
                        props: {},
                    },
                    "b",
                ],
            },
            "foo.1"
        );

        expect(updatedData).toEqual({
            foo: {
                id: "a",
                props: {},
            },
        });
    });
});

/**
 * Gets updated data by adding data
 */
describe("getUpdatedDataWithTargetData", () => {
    describe("should return updated data when moving a children item to a children property", () => {
        test("when the children property contains a string and targets a string", () => {
            const updatedData: any = getUpdatedDataWithTargetData({
                data: {
                    foo: "b",
                },
                updatedSourceData: "a",
                targetDataLocation: "foo",
                sourceDataLocation: "bar",
                type: NavigationDataType.childrenItem,
                direction: null,
            });

            expect(updatedData.foo).toEqual(["b", "a"]);
        });
        test("when the children property contains a string and targets a react child", () => {
            const updatedData: any = getUpdatedDataWithTargetData({
                data: {
                    foo: {
                        id: "b",
                        props: {},
                    },
                },
                updatedSourceData: "a",
                targetDataLocation: "foo.props",
                sourceDataLocation: "bar",
                type: NavigationDataType.childrenItem,
                direction: null,
            });

            expect(updatedData.foo).toEqual([
                {
                    id: "b",
                    props: {},
                },
                "a",
            ]);
        });
        test("when the children property contains a react child and targets a react child", () => {
            const updatedData: any = getUpdatedDataWithTargetData({
                data: {
                    foo: {
                        id: "bar",
                        props: {},
                    },
                },
                updatedSourceData: {
                    id: "a",
                },
                targetDataLocation: "foo.props",
                sourceDataLocation: "bar",
                type: NavigationDataType.childrenItem,
                direction: null,
            });

            expect(updatedData.foo).toEqual([
                {
                    id: "bar",
                    props: {},
                },
                {
                    id: "a",
                },
            ]);
        });
        test("when the children property contains a react child and targets a string", () => {
            const updatedData: any = getUpdatedDataWithTargetData({
                data: {
                    foo: "a",
                },
                updatedSourceData: {
                    id: "b",
                    props: {},
                },
                targetDataLocation: "foo",
                sourceDataLocation: "bar",
                type: NavigationDataType.childrenItem,
                direction: null,
            });

            expect(updatedData.foo).toEqual([
                "a",
                {
                    id: "b",
                    props: {},
                },
            ]);
        });
    });
    describe("should return updated data when moving a children item adjacent to a children item", () => {
        describe("containing string(s)", () => {
            test("when the children item targets a different children property above the existing item", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: "b",
                    },
                    updatedSourceData: "a",
                    targetDataLocation: "foo",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.childrenItem,
                    direction: VerticalDragDirection.up,
                });

                expect(updatedData.foo).toEqual(["a", "b"]);
            });
            test("when the children item targets a different children property above the existing item", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: "b",
                    },
                    updatedSourceData: "a",
                    targetDataLocation: "foo",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.childrenItem,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData.foo).toEqual(["b", "a"]);
            });
            test("when the children item targets a different children property array", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: ["b", "c"],
                    },
                    updatedSourceData: "a",
                    targetDataLocation: "foo",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.children,
                    direction: null,
                });

                expect(updatedData.foo).toEqual(["b", "c", "a"]);
            });
            test("when the children item targets a different children property array above an item", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: ["a", "b", "c"],
                    },
                    updatedSourceData: "d",
                    targetDataLocation: "foo.1",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.childrenItem,
                    direction: VerticalDragDirection.up,
                });

                expect(updatedData.foo).toEqual(["a", "d", "b", "c"]);
            });
            test("when the children item targets a different children property array below an item", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: ["a", "b", "c"],
                    },
                    updatedSourceData: "d",
                    targetDataLocation: "foo.1",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.childrenItem,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData.foo).toEqual(["a", "b", "d", "c"]);
            });
            test("when the children item targets the same children property array", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: ["a", "b"],
                    },
                    updatedSourceData: "c",
                    targetDataLocation: "foo.0",
                    sourceDataLocation: "foo.2",
                    type: NavigationDataType.childrenItem,
                    direction: null,
                });

                expect(updatedData.foo).toEqual(["a", "c", "b"]);
            });
            test("when the children item targets the same children property array above an item", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: ["a", "b"],
                    },
                    updatedSourceData: "c",
                    targetDataLocation: "foo.0",
                    sourceDataLocation: "foo.2",
                    type: NavigationDataType.childrenItem,
                    direction: VerticalDragDirection.up,
                });

                expect(updatedData.foo).toEqual(["c", "a", "b"]);
            });
            test("when the children item targets the same children property array below an item", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: ["a", "b"],
                    },
                    updatedSourceData: "c",
                    targetDataLocation: "foo.0",
                    sourceDataLocation: "foo.2",
                    type: NavigationDataType.childrenItem,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData.foo).toEqual(["a", "c", "b"]);
            });
        });
        describe("containing children item(s)", () => {
            test("when the children item targets a different children property above the existing item", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: {
                            id: "b",
                            props: {},
                        },
                    },
                    updatedSourceData: {
                        id: "a",
                        props: {},
                    },
                    targetDataLocation: "foo.props",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.childrenItem,
                    direction: VerticalDragDirection.up,
                });

                expect(updatedData.foo).toEqual([
                    {
                        id: "a",
                        props: {},
                    },
                    {
                        id: "b",
                        props: {},
                    },
                ]);
            });
            test("when the children item targets a different children property above the existing item", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: {
                            id: "b",
                            props: {},
                        },
                    },
                    updatedSourceData: {
                        id: "a",
                        props: {},
                    },
                    targetDataLocation: "foo.props",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.childrenItem,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData.foo).toEqual([
                    {
                        id: "b",
                        props: {},
                    },
                    {
                        id: "a",
                        props: {},
                    },
                ]);
            });
            test("when the children item targets a different children property array", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: [
                            {
                                id: "b",
                                props: {},
                            },
                            {
                                id: "c",
                                props: {},
                            },
                        ],
                    },
                    updatedSourceData: {
                        id: "a",
                        props: {},
                    },
                    targetDataLocation: "foo.1.props",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.childrenItem,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData.foo).toEqual([
                    {
                        id: "b",
                        props: {},
                    },
                    {
                        id: "c",
                        props: {},
                    },
                    {
                        id: "a",
                        props: {},
                    },
                ]);
            });
            test("when the children item targets a different children property array above an item", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: [
                            {
                                id: "a",
                                props: {},
                            },
                            {
                                id: "b",
                                props: {},
                            },
                            {
                                id: "c",
                                props: {},
                            },
                        ],
                    },
                    updatedSourceData: {
                        id: "d",
                        props: {},
                    },
                    targetDataLocation: "foo.1.props",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.childrenItem,
                    direction: VerticalDragDirection.up,
                });

                expect(updatedData.foo).toEqual([
                    {
                        id: "a",
                        props: {},
                    },
                    {
                        id: "d",
                        props: {},
                    },
                    {
                        id: "b",
                        props: {},
                    },
                    {
                        id: "c",
                        props: {},
                    },
                ]);
            });
            test("when the children item targets a different children property array below an item", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: [
                            {
                                id: "a",
                                props: {},
                            },
                            {
                                id: "b",
                                props: {},
                            },
                            {
                                id: "c",
                                props: {},
                            },
                        ],
                    },
                    updatedSourceData: {
                        id: "d",
                        props: {},
                    },
                    targetDataLocation: "foo.1.props",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.childrenItem,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData.foo).toEqual([
                    {
                        id: "a",
                        props: {},
                    },
                    {
                        id: "b",
                        props: {},
                    },
                    {
                        id: "d",
                        props: {},
                    },
                    {
                        id: "c",
                        props: {},
                    },
                ]);
            });
            test("when the children item targets the same children property array", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: [
                            {
                                id: "a",
                                props: {},
                            },
                            {
                                id: "b",
                                props: {},
                            },
                        ],
                    },
                    updatedSourceData: {
                        id: "c",
                        props: {},
                    },
                    targetDataLocation: "foo.0.props",
                    sourceDataLocation: "foo.2.props",
                    type: NavigationDataType.childrenItem,
                    direction: null,
                });

                expect(updatedData.foo).toEqual([
                    {
                        id: "a",
                        props: {},
                    },
                    {
                        id: "c",
                        props: {},
                    },
                    {
                        id: "b",
                        props: {},
                    },
                ]);
            });
            test("when the children item targets the same children property array above an item", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: [
                            {
                                id: "a",
                                props: {},
                            },
                            {
                                id: "b",
                                props: {},
                            },
                        ],
                    },
                    updatedSourceData: {
                        id: "c",
                        props: {},
                    },
                    targetDataLocation: "foo.0.props",
                    sourceDataLocation: "foo.2.props",
                    type: NavigationDataType.childrenItem,
                    direction: VerticalDragDirection.up,
                });

                expect(updatedData.foo).toEqual([
                    {
                        id: "c",
                        props: {},
                    },
                    {
                        id: "a",
                        props: {},
                    },
                    {
                        id: "b",
                        props: {},
                    },
                ]);
            });
            test("when the children item targets the same children property array below an item", () => {
                const updatedData: any = getUpdatedDataWithTargetData({
                    data: {
                        foo: [
                            {
                                id: "a",
                                props: {},
                            },
                            {
                                id: "b",
                                props: {},
                            },
                        ],
                    },
                    updatedSourceData: {
                        id: "c",
                        props: {},
                    },
                    targetDataLocation: "foo.0.props",
                    sourceDataLocation: "foo.2.props",
                    type: NavigationDataType.childrenItem,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData.foo).toEqual([
                    {
                        id: "a",
                        props: {},
                    },
                    {
                        id: "c",
                        props: {},
                    },
                    {
                        id: "b",
                        props: {},
                    },
                ]);
            });
        });
    });
});
