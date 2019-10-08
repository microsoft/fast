import "jest";
import { getNavigationFromData, getUpdatedData } from "./navigation.utilities";
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
            NavigationDataType.primitiveChild
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
        expect(navigationFromData[0].items[0].type).toEqual(NavigationDataType.component);
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
        expect(navigationFromData[0].items[0].type).toEqual(NavigationDataType.component);
        expect(navigationFromData[0].items[0].dataLocation).toEqual("children[0].props");
        expect(navigationFromData[0].items[0].items).toEqual(void 0);
        expect(navigationFromData[0].items[1].text).toEqual(childOptions[0].schema.title);
        expect(navigationFromData[0].items[1].type).toEqual(NavigationDataType.component);
        expect(navigationFromData[0].items[1].dataLocation).toEqual("children[1].props");
        expect(navigationFromData[0].items[1].items).toEqual(void 0);
        expect(navigationFromData[0].items[2].text).toEqual(childrenText);
        expect(navigationFromData[0].items[2].type).toEqual(
            NavigationDataType.primitiveChild
        );
        expect(navigationFromData[0].items[2].dataLocation).toEqual("children[2]");
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
        expect(navigationFromData[0].items[0].type).toEqual(NavigationDataType.component);
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
            NavigationDataType.component
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
        expect(navigationFromData[0].items[0].type).toEqual(NavigationDataType.component);
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
            "children.props.children[0].props"
        );
        expect(navigationFromData[0].items[0].items[0].items[0].text).toEqual(
            childOptions[0].schema.title
        );
        expect(navigationFromData[0].items[0].items[0].items[0].type).toEqual(
            NavigationDataType.component
        );
        expect(navigationFromData[0].items[0].items[0].items[0].items).toEqual(void 0);
        expect(navigationFromData[0].items[0].items[0].items[1].dataLocation).toEqual(
            "children.props.children[1].props"
        );
        expect(navigationFromData[0].items[0].items[0].items[1].text).toEqual(
            childOptions[0].schema.title
        );
        expect(navigationFromData[0].items[0].items[0].items[1].type).toEqual(
            NavigationDataType.component
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
    test("should return an array item with square brackets for the data location if an array item is passed", () => {
        const data: any = [{ a: "bar" }];
        const navigationFromData: TreeNavigation = getNavigationFromData(
            data,
            {
                title: "root title",
                type: "array",
                items: {
                    title: "foo title",
                    type: "object",
                    properties: {
                        a: {
                            type: "string",
                        },
                    },
                },
            },
            childOptions
        );

        expect(navigationFromData.items[0].dataLocation).toEqual("[0]");

        const dataWithArrayInObject: any = {
            foo: [
                {
                    a: "bar",
                },
            ],
        };
        const navigationFromDataArrayInObject: TreeNavigation = getNavigationFromData(
            dataWithArrayInObject,
            {
                type: "object",
                properties: {
                    foo: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                a: {
                                    type: "string",
                                },
                            },
                        },
                    },
                },
            },
            childOptions
        );

        expect(navigationFromDataArrayInObject.items[0].items[0].dataLocation).toEqual(
            "foo[0]"
        );
    });
    test("should return deeply nested array items that terminate in a single children item", () => {
        const data: any = {
            children: {
                id: childOptions[1].schema.id,
                props: {
                    children: [
                        {
                            id: childOptions[1].schema.id,
                            props: {
                                children: {
                                    id: childOptions[1].schema.id,
                                    props: {
                                        children: [
                                            {
                                                id: childOptions[0].schema.id,
                                                props: {},
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                        "Foo",
                    ],
                },
            },
        };

        const navigationFromData: TreeNavigation[] | void = getNavigationFromData(
            data,
            childrenSchema,
            childOptions
        ).items;

        expect(navigationFromData[0].dataLocation).toEqual("children");
        expect(navigationFromData[0].items[0].dataLocation).toEqual("children.props");
        expect(navigationFromData[0].items[0].items[0].dataLocation).toEqual(
            "children.props.children"
        );
        expect(navigationFromData[0].items[0].items[0].items[0].dataLocation).toEqual(
            "children.props.children[0].props"
        );
        expect(navigationFromData[0].items[0].items[0].items[1].dataLocation).toEqual(
            "children.props.children[1]"
        );
        expect(
            navigationFromData[0].items[0].items[0].items[0].items[0].dataLocation
        ).toEqual("children.props.children[0].props.children");
        expect(
            navigationFromData[0].items[0].items[0].items[0].items[0].items[0]
                .dataLocation
        ).toEqual("children.props.children[0].props.children.props");
        expect(
            navigationFromData[0].items[0].items[0].items[0].items[0].items[0].items[0]
                .dataLocation
        ).toEqual("children.props.children[0].props.children.props.children");
    });
});

/**
 * Gets updated data by adding data
 */
describe("getUpdatedData", () => {
    describe("should return updated data when moving a children item to a component", () => {
        test("when the children property contains a string and targets a string", () => {
            const updatedData: any = getUpdatedData({
                data: {
                    foo: "b",
                    bar: "a",
                },
                targetDataLocation: "foo",
                sourceDataLocation: "bar",
                type: NavigationDataType.primitiveChild,
                direction: VerticalDragDirection.center,
            });

            expect(updatedData).toEqual({ foo: ["a", "b"] });
        });
        test("when the children property contains a string and targets a react child", () => {
            const updatedData: any = getUpdatedData({
                data: {
                    foo: {
                        id: "b",
                        props: {},
                    },
                    bar: "a",
                },
                targetDataLocation: "foo",
                sourceDataLocation: "bar",
                type: NavigationDataType.primitiveChild,
                direction: VerticalDragDirection.center,
            });

            expect(updatedData).toEqual({
                foo: [
                    "a",
                    {
                        id: "b",
                        props: {},
                    },
                ],
            });
        });
        test("when the children property contains a react child and targets a react child", () => {
            const updatedData: any = getUpdatedData({
                data: {
                    foo: {
                        id: "bar",
                        props: {},
                    },
                    bar: {
                        id: "a",
                    },
                },
                targetDataLocation: "foo",
                sourceDataLocation: "bar",
                type: NavigationDataType.primitiveChild,
                direction: VerticalDragDirection.center,
            });

            expect(updatedData).toEqual({
                foo: [
                    {
                        id: "a",
                    },
                    {
                        id: "bar",
                        props: {},
                    },
                ],
            });
        });
        test("when the children property contains a react child and targets a string", () => {
            const updatedData: any = getUpdatedData({
                data: {
                    foo: "a",
                    bar: {
                        id: "b",
                        props: {},
                    },
                },
                targetDataLocation: "foo",
                sourceDataLocation: "bar",
                type: NavigationDataType.primitiveChild,
                direction: VerticalDragDirection.center,
            });

            expect(updatedData).toEqual({
                foo: [
                    {
                        id: "b",
                        props: {},
                    },
                    "a",
                ],
            });
        });
        test("when the children property is undefined", () => {
            const updatedData: any = getUpdatedData({
                data: {
                    bar: {
                        id: "b",
                        props: {},
                    },
                },
                targetDataLocation: "foo",
                sourceDataLocation: "bar",
                type: NavigationDataType.children,
                direction: VerticalDragDirection.center,
            });

            expect(updatedData).toEqual({
                foo: {
                    id: "b",
                    props: {},
                },
            });
        });
        test("when the children property is in an array and targets on a single child", () => {
            const updatedData: any = getUpdatedData({
                data: {
                    foo: ["a", "b"],
                    bar: {
                        id: "b",
                        props: {},
                    },
                },
                targetDataLocation: "bar",
                sourceDataLocation: "foo.1",
                type: NavigationDataType.primitiveChild,
                direction: VerticalDragDirection.center,
            });

            expect(updatedData).toEqual({
                foo: "a",
                bar: [
                    "b",
                    {
                        id: "b",
                        props: {},
                    },
                ],
            });
        });
        test("when the children property is in an array and targets above a single child", () => {
            const updatedData: any = getUpdatedData({
                data: {
                    foo: ["a", "b"],
                    bar: {
                        id: "b",
                        props: {},
                    },
                },
                targetDataLocation: "bar",
                sourceDataLocation: "foo.1",
                type: NavigationDataType.component,
                direction: VerticalDragDirection.up,
            });

            expect(updatedData).toEqual({
                foo: "a",
                bar: [
                    "b",
                    {
                        id: "b",
                        props: {},
                    },
                ],
            });
        });
        test("when the children property is in an array and targets below a single child", () => {
            const updatedData: any = getUpdatedData({
                data: {
                    foo: ["a", "b"],
                    bar: {
                        id: "b",
                        props: {},
                    },
                },
                targetDataLocation: "bar",
                sourceDataLocation: "foo.1",
                type: NavigationDataType.component,
                direction: VerticalDragDirection.down,
            });

            expect(updatedData).toEqual({
                foo: "a",
                bar: [
                    {
                        id: "b",
                        props: {},
                    },
                    "b",
                ],
            });
        });
        test("when the children property is in an array and the target is in a different array", () => {
            const updatedData: any = getUpdatedData({
                data: {
                    foo: ["a", "b"],
                    bar: [
                        {
                            id: "b",
                            props: {},
                        },
                        "c",
                    ],
                },
                targetDataLocation: "bar",
                sourceDataLocation: "foo.1",
                type: NavigationDataType.children,
                direction: VerticalDragDirection.center,
            });

            expect(updatedData).toEqual({
                foo: "a",
                bar: [
                    "b",
                    {
                        id: "b",
                        props: {},
                    },
                    "c",
                ],
            });
        });
        test("when the children property is in an array and the target is above an item in a different array", () => {
            const updatedData: any = getUpdatedData({
                data: {
                    foo: ["a", "b"],
                    bar: [
                        {
                            id: "b",
                            props: {},
                        },
                        "c",
                    ],
                },
                targetDataLocation: "bar.1",
                sourceDataLocation: "foo.1",
                type: NavigationDataType.component,
                direction: VerticalDragDirection.up,
            });

            expect(updatedData).toEqual({
                foo: "a",
                bar: [
                    {
                        id: "b",
                        props: {},
                    },
                    "b",
                    "c",
                ],
            });
        });
        test("when the children property is in an array and the target is below an item in a different array", () => {
            const updatedData: any = getUpdatedData({
                data: {
                    foo: ["a", "b"],
                    bar: [
                        {
                            id: "b",
                            props: {},
                        },
                        "c",
                    ],
                },
                targetDataLocation: "bar.1",
                sourceDataLocation: "foo.1",
                type: NavigationDataType.component,
                direction: VerticalDragDirection.down,
            });

            expect(updatedData).toEqual({
                foo: "a",
                bar: [
                    {
                        id: "b",
                        props: {},
                    },
                    "c",
                    "b",
                ],
            });
        });
        test("when the children property is not in an array and targets a single child", () => {
            const updatedData: any = getUpdatedData({
                data: {
                    children: {
                        id: childOptions[1].schema.id,
                        props: {
                            children: {
                                id: childOptions[0].schema.id,
                                props: {},
                            },
                        },
                    },
                },
                targetDataLocation: "children",
                sourceDataLocation: "children.props.children",
                type: NavigationDataType.children,
                direction: VerticalDragDirection.center,
            });

            expect(updatedData).toEqual({
                children: [
                    {
                        id: childOptions[0].schema.id,
                        props: {},
                    },
                    {
                        id: childOptions[1].schema.id,
                        props: {},
                    },
                ],
            });
        });
    });
    describe("should return updated data when moving a children item adjacent to a children item", () => {
        describe("containing string(s)", () => {
            test("when the children item targets a different children property above the existing item", () => {
                const updatedData: any = getUpdatedData({
                    data: {
                        foo: "b",
                        bar: "a",
                    },
                    targetDataLocation: "foo",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.up,
                });

                expect(updatedData.foo).toEqual(["a", "b"]);
            });
            test("when the children item targets a different children property above the existing item", () => {
                const updatedData: any = getUpdatedData({
                    data: {
                        foo: "b",
                        bar: "a",
                    },
                    targetDataLocation: "foo",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData.foo).toEqual(["b", "a"]);
            });
            test("when the children item targets a different children property array above an item", () => {
                const updatedData: any = getUpdatedData({
                    data: {
                        foo: ["a", "b", "c"],
                        bar: "d",
                    },
                    targetDataLocation: "foo.1",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.up,
                });

                expect(updatedData).toEqual({ foo: ["a", "d", "b", "c"] });
            });
            test("when the children item targets a different children property array below an item", () => {
                const updatedData: any = getUpdatedData({
                    data: {
                        foo: ["a", "b", "c"],
                        bar: "d",
                    },
                    targetDataLocation: "foo.1",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData).toEqual({ foo: ["a", "b", "d", "c"] });
            });
            test("when the children item targets the same children property array", () => {
                const updatedData: any = getUpdatedData({
                    data: {
                        foo: ["a", "b", "c"],
                    },
                    targetDataLocation: "foo.0",
                    sourceDataLocation: "foo.2",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData).toEqual({ foo: ["a", "c", "b"] });
            });
            test("when the children item targets the same children property array above an item", () => {
                const updatedData: any = getUpdatedData({
                    data: {
                        foo: ["a", "b", "c"],
                    },
                    targetDataLocation: "foo.0",
                    sourceDataLocation: "foo.2",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.up,
                });

                expect(updatedData).toEqual({ foo: ["c", "a", "b"] });
            });
            test("when the children item targets the same children property array below an item", () => {
                const updatedData: any = getUpdatedData({
                    data: {
                        foo: ["a", "b", "c"],
                    },
                    targetDataLocation: "foo.0",
                    sourceDataLocation: "foo.2",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData.foo).toEqual(["a", "c", "b"]);
            });
            test("when the children items target the same children property array below the source item", () => {
                const updatedData: any = getUpdatedData({
                    data: {
                        foo: ["a", "b", "c"],
                    },
                    targetDataLocation: "foo.1",
                    sourceDataLocation: "foo.0",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData.foo).toEqual(["b", "a", "c"]);
            });
            test("when the children items target the same children property array at the end of the source item", () => {
                const updatedData: any = getUpdatedData({
                    data: {
                        foo: ["a", "b", "c"],
                    },
                    targetDataLocation: "foo.2",
                    sourceDataLocation: "foo.0",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData.foo).toEqual(["b", "c", "a"]);
            });
        });
        describe("containing children item(s)", () => {
            test("when the children item targets a different children property above the existing item", () => {
                const updatedData: any = getUpdatedData({
                    data: {
                        foo: {
                            id: "b",
                            props: {},
                        },
                        bar: {
                            id: "a",
                            props: {},
                        },
                    },
                    targetDataLocation: "foo",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.up,
                });

                expect(updatedData).toEqual({
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
                });
            });
            test("when the children item targets a different children property above the existing item", () => {
                const updatedData: any = getUpdatedData({
                    data: {
                        foo: {
                            id: "b",
                            props: {},
                        },
                        bar: {
                            id: "a",
                            props: {},
                        },
                    },
                    targetDataLocation: "foo",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData).toEqual({
                    foo: [
                        {
                            id: "b",
                            props: {},
                        },
                        {
                            id: "a",
                            props: {},
                        },
                    ],
                });
            });
            test("when the children item targets a different children property array", () => {
                const updatedData: any = getUpdatedData({
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
                        bar: {
                            id: "a",
                            props: {},
                        },
                    },
                    targetDataLocation: "foo.1",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.down,
                });

                expect(updatedData).toEqual({
                    foo: [
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
                    ],
                });
            });
            test("when the children item targets a different children property array above an item", () => {
                const updatedData: any = getUpdatedData({
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
                        bar: {
                            id: "d",
                            props: {},
                        },
                    },
                    targetDataLocation: "foo.1",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.up,
                });

                expect(updatedData).toEqual({
                    foo: [
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
                    ],
                });
            });
            test("when the children item targets a different children property array below an item", () => {
                const updatedData: any = getUpdatedData({
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
                        bar: {
                            id: "d",
                            props: {},
                        },
                    },
                    targetDataLocation: "foo.1",
                    sourceDataLocation: "bar",
                    type: NavigationDataType.component,
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
                const updatedData: any = getUpdatedData({
                    data: {
                        foo: [
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
                        ],
                    },
                    targetDataLocation: "foo.0",
                    sourceDataLocation: "foo.2",
                    type: NavigationDataType.component,
                    direction: VerticalDragDirection.up,
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
            test("when the children item targets the same children property array above an item", () => {
                const updatedData: any = getUpdatedData({
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
                    targetDataLocation: "foo.0",
                    sourceDataLocation: "foo.2",
                    type: NavigationDataType.component,
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
                const updatedData: any = getUpdatedData({
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
                    targetDataLocation: "foo.0",
                    sourceDataLocation: "foo.2",
                    type: NavigationDataType.component,
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
