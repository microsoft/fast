import "jest";
import { getNavigationFromData } from "./navigation.utilities";
import { NavigationDataType, TreeNavigation } from "./navigation.props";
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
