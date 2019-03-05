import "jest";
import { getNavigationFromData } from "./navigation.utilities";
import { ItemType, TreeNavigation } from "./navigation.props";
import { ChildOptionItem } from "../data-utilities";

import noChildrenSchema from "../../app/configs/no-children.schema.json";
import childrenSchema from "../../app/configs/children.schema.json";

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
            items: [],
            text: "Undefined",
            type: "children",
        });
    });
    test("should return a single item if a single string child has been passed", () => {
        const childrenText: string = "Foo";
        const data: any = {
            children: childrenText,
        };
        const navigationFromData: TreeNavigation[] = getNavigationFromData(
            data,
            childrenSchema,
            childOptions
        ).items;
        expect(navigationFromData).toHaveLength(1);
        expect(navigationFromData[0].items).toEqual(undefined);
        expect(navigationFromData[0].dataLocation).toEqual("children");
        expect(navigationFromData[0].text).toEqual(childrenText);
        expect(navigationFromData[0].type).toEqual(ItemType.children);
    });
    test("should return a single item if a single child has been passed", () => {
        const data: any = {
            children: {
                id: childOptions[0].schema.id,
                props: {},
            },
        };

        const navigationFromData: TreeNavigation[] = getNavigationFromData(
            data,
            childrenSchema,
            childOptions
        ).items;
        expect(navigationFromData).toHaveLength(1);
        expect(navigationFromData[0].items).toEqual(undefined);
        expect(navigationFromData[0].dataLocation).toEqual("children.props");
        expect(navigationFromData[0].text).toEqual(childOptions[0].schema.title);
        expect(navigationFromData[0].type).toEqual(ItemType.children);
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

        const navigationFromData: TreeNavigation[] = getNavigationFromData(
            data,
            childrenSchema,
            childOptions
        ).items;

        expect(navigationFromData).toHaveLength(3);
        expect(navigationFromData[0].items).toEqual(undefined);
        expect(navigationFromData[0].dataLocation).toEqual("children[0].props");
        expect(navigationFromData[0].text).toEqual(childOptions[0].schema.title);
        expect(navigationFromData[0].type).toEqual(ItemType.children);
        expect(navigationFromData[1].items).toEqual(undefined);
        expect(navigationFromData[1].dataLocation).toEqual("children[1].props");
        expect(navigationFromData[1].text).toEqual(childOptions[0].schema.title);
        expect(navigationFromData[1].type).toEqual(ItemType.children);
        expect(navigationFromData[2].items).toEqual(undefined);
        expect(navigationFromData[2].dataLocation).toEqual("children[2]");
        expect(navigationFromData[2].text).toEqual(childrenText);
        expect(navigationFromData[2].type).toEqual(ItemType.children);
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

        const navigationFromData: TreeNavigation[] = getNavigationFromData(
            data,
            childrenSchema,
            childOptions
        ).items;
        expect(navigationFromData).toHaveLength(1);
        expect(navigationFromData[0].dataLocation).toEqual("children.props");
        expect(navigationFromData[0].text).toEqual(childOptions[1].schema.title);
        expect(navigationFromData[0].type).toEqual(ItemType.children);
        expect(navigationFromData[0].items).toHaveProperty("length");
        expect(navigationFromData[0].items).toHaveLength(1);
        expect(navigationFromData[0].items[0].dataLocation).toEqual(
            "children.props.children.props"
        );
        expect(navigationFromData[0].items[0].text).toEqual(childOptions[0].schema.title);
        expect(navigationFromData[0].items[0].type).toEqual(ItemType.children);
        expect(navigationFromData[0].items[0].items).toEqual(undefined);
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

        const navigationFromData: TreeNavigation[] = getNavigationFromData(
            data,
            childrenSchema,
            childOptions
        ).items;
        expect(navigationFromData).toHaveLength(1);
        expect(navigationFromData[0].dataLocation).toEqual("children.props");
        expect(navigationFromData[0].text).toEqual(childOptions[1].schema.title);
        expect(navigationFromData[0].type).toEqual(ItemType.children);
        expect(navigationFromData[0].items).toHaveProperty("length");
        expect(navigationFromData[0].items).toHaveLength(2);
        expect(navigationFromData[0].items[0].dataLocation).toEqual(
            "children.props.children[0].props"
        );
        expect(navigationFromData[0].items[0].text).toEqual(childOptions[0].schema.title);
        expect(navigationFromData[0].items[0].type).toEqual(ItemType.children);
        expect(navigationFromData[0].items[0].items).toEqual(undefined);
        expect(navigationFromData[0].items[1].dataLocation).toEqual(
            "children.props.children[1].props"
        );
        expect(navigationFromData[0].items[1].text).toEqual(childOptions[0].schema.title);
        expect(navigationFromData[0].items[1].type).toEqual(ItemType.children);
        expect(navigationFromData[0].items[1].items).toEqual(undefined);
    });
    test("should return multiple items if multiple children with nested children have been passed", () => {
        const data: any = {
            children: [
                {
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
                {
                    id: childOptions[1].schema.id,
                    props: {
                        children: {
                            id: childOptions[0].schema.id,
                            props: {},
                        },
                    },
                },
            ],
        };

        const navigationFromData: TreeNavigation[] = getNavigationFromData(
            data,
            childrenSchema,
            childOptions
        ).items;
        expect(navigationFromData).toHaveLength(2);
        expect(navigationFromData[0].dataLocation).toEqual("children[0].props");
        expect(navigationFromData[0].text).toEqual(childOptions[1].schema.title);
        expect(navigationFromData[0].type).toEqual(ItemType.children);
        expect(navigationFromData[0].items).toHaveProperty("length");
        expect(navigationFromData[0].items).toHaveLength(2);
        expect(navigationFromData[0].items[0].dataLocation).toEqual(
            "children[0].props.children[0].props"
        );
        expect(navigationFromData[0].items[0].text).toEqual(childOptions[0].schema.title);
        expect(navigationFromData[0].items[0].type).toEqual(ItemType.children);
        expect(navigationFromData[0].items[0].items).toEqual(undefined);
        expect(navigationFromData[0].items[1].dataLocation).toEqual(
            "children[0].props.children[1].props"
        );
        expect(navigationFromData[0].items[1].text).toEqual(childOptions[0].schema.title);
        expect(navigationFromData[0].items[1].type).toEqual(ItemType.children);
        expect(navigationFromData[0].items[1].items).toEqual(undefined);
        expect(navigationFromData[1].dataLocation).toEqual("children[1].props");
        expect(navigationFromData[1].text).toEqual(childOptions[1].schema.title);
        expect(navigationFromData[1].type).toEqual(ItemType.children);
        expect(navigationFromData[1].items).toHaveProperty("length");
        expect(navigationFromData[1].items).toHaveLength(1);
        expect(navigationFromData[1].items[0].dataLocation).toEqual(
            "children[1].props.children.props"
        );
        expect(navigationFromData[1].items[0].text).toEqual(childOptions[0].schema.title);
        expect(navigationFromData[1].items[0].type).toEqual(ItemType.children);
        expect(navigationFromData[1].items[0].items).toEqual(undefined);
    });
});
