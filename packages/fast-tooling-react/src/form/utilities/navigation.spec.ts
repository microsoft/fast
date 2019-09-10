import "jest";
import Navigation, { NavigationItem } from "./navigation";
import { FormChildOptionItem } from "../form.props";
import { reactChildrenStringSchema } from "../controls/control.children.text";
import oneOfSchema from "../../__tests__/schemas/one-of.schema.json";
import childrenSchema from "../../__tests__/schemas/children.schema.json";
import textFieldSchema from "../../__tests__/schemas/textarea.schema.json";
import generalSchema from "../../__tests__/schemas/general.schema.json";
import deeplyNestedOneOfSchema from "../../__tests__/schemas/one-of-deeply-nested.schema.json";

/**
 * Gets the navigation
 */
describe("Navigation", () => {
    const childOptions: FormChildOptionItem[] = [
        {
            name: childrenSchema.id,
            component: null,
            schema: childrenSchema,
        },
        {
            name: textFieldSchema.id,
            component: null,
            schema: textFieldSchema,
        },
        {
            name: generalSchema.id,
            component: null,
            schema: generalSchema,
        },
        { name: oneOfSchema.id, component: null, schema: oneOfSchema },
    ];

    test("should return a single navigation item when the location is at the root", () => {
        const data: any = {
            items: ["foo"],
        };
        const schema: any = {
            id: "schemaId",
            type: "object",
            properties: {
                items: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        };
        const nav: Navigation = new Navigation({
            data,
            schema,
            dataLocation: "",
            childOptions: [],
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(1);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            title: "Untitled",
            data,
            schema,
            default: void 0,
        });
    });
    test("should return navigation items for a nested property", () => {
        const data: any = {
            foo: {
                bar: "bat",
            },
        };
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "object",
                    properties: {
                        bar: {
                            type: "string",
                        },
                    },
                },
            },
        };
        const nav: Navigation = new Navigation({
            data,
            schema,
            dataLocation: "foo",
            childOptions: [],
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            title: "Untitled",
            schema,
            data,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "foo",
            schemaLocation: "properties.foo",
            title: "Untitled",
            schema,
            data: data.foo,
            default: void 0,
        });
    });
    test("should return navigation items for a nested property when no data has been provided", () => {
        const data: any = {};
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "object",
                    properties: {
                        bar: {
                            type: "string",
                        },
                    },
                },
            },
        };
        const nav: Navigation = new Navigation({
            data,
            schema,
            dataLocation: "foo",
            childOptions: [],
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            title: "Untitled",
            schema,
            data: {},
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "foo",
            schemaLocation: "properties.foo",
            title: "Untitled",
            schema,
            data: void 0,
            default: void 0,
        });
    });
    test("should return navigation items for an array", () => {
        const data: any = {
            items: ["foo"],
        };
        const schema: any = {
            type: "object",
            properties: {
                items: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        };
        const nav: Navigation = new Navigation({
            data,
            schema,
            dataLocation: "items[0]",
            childOptions: [],
        });

        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            title: "Untitled",
            schema,
            data,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "items[0]",
            schemaLocation: "properties.items.items",
            title: "Untitled",
            schema,
            data: data.items[0],
            default: void 0,
        });
    });
    test("should return navigation items when the schema includes an anyOf", () => {
        const data: any = {
            foo: {
                bar: "bat",
            },
        };
        const schema: any = {
            type: "object",
            anyOf: [
                {
                    properties: {
                        foo: {
                            type: "object",
                            properties: {
                                bar: {
                                    type: "string",
                                },
                            },
                        },
                    },
                    required: ["foo"],
                },
                {
                    properties: {
                        bar: {
                            type: "object",
                            properties: {
                                foo: {
                                    type: "string",
                                },
                            },
                        },
                    },
                    required: ["bar"],
                },
            ],
        };
        const nav: Navigation = new Navigation({
            data,
            schema,
            dataLocation: "foo",
            childOptions: [],
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            title: "Untitled",
            schema,
            data,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "foo",
            schemaLocation: "anyOf[0].properties.foo",
            title: "Untitled",
            schema,
            data: data.foo,
            default: void 0,
        });
    });
    test("should return navigation items when the schema includes a oneOf", () => {
        const data: any = {
            bar: {
                foo: "bat",
            },
        };
        const schema: any = {
            id: "schemaId",
            type: "object",
            oneOf: [
                {
                    properties: {
                        foo: {
                            type: "object",
                            properties: {
                                bar: {
                                    type: "string",
                                },
                            },
                        },
                    },
                    required: ["foo"],
                },
                {
                    properties: {
                        bar: {
                            type: "object",
                            properties: {
                                foo: {
                                    type: "string",
                                },
                            },
                        },
                    },
                    required: ["bar"],
                },
            ],
        };
        const nav: Navigation = new Navigation({
            data,
            schema,
            dataLocation: "bar",
            childOptions: [],
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            title: "Untitled",
            schema,
            data,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "bar",
            schemaLocation: "oneOf[1].properties.bar",
            title: "Untitled",
            schema,
            data: data.bar,
            default: void 0,
        });
    });
    test("should return navigation items for children", () => {
        const data: any = {
            children: "foo",
        };
        const schema: any = {
            type: "object",
            reactProperties: {
                children: {
                    type: "children",
                },
            },
        };
        const nav: Navigation = new Navigation({
            data,
            schema,
            dataLocation: "children",
            childOptions: [],
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            data,
            schema,
            default: void 0,
            title: "Untitled",
        });
        expect(navItems[1]).toEqual({
            dataLocation: "children",
            schemaLocation: "",
            data: data.children,
            schema: reactChildrenStringSchema,
            default: void 0,
            title: reactChildrenStringSchema.title,
        });
    });
    test("should return navigation items for nested children", () => {
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {
                    children: {
                        id: textFieldSchema.id,
                        props: {},
                    },
                },
            },
        };
        const nav: Navigation = new Navigation({
            dataLocation: "children.props.children.props",
            data,
            schema: childrenSchema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(3);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            data,
            schema: childrenSchema,
            default: void 0,
            title: childrenSchema.title,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "children.props",
            schemaLocation: "",
            data: data.children.props,
            schema: childrenSchema,
            default: void 0,
            title: childrenSchema.title,
        });
        expect(navItems[2]).toEqual({
            dataLocation: "children.props.children.props",
            schemaLocation: "",
            data: data.children.props.children.props,
            schema: textFieldSchema,
            default: void 0,
            title: textFieldSchema.title,
        });
    });
    test("should return navigation items for children nested in an array of children", () => {
        const data: any = {
            children: [
                {
                    id: childrenSchema.id,
                    props: {
                        children: {
                            id: textFieldSchema.id,
                            props: {},
                        },
                    },
                },
            ],
        };
        const nav: Navigation = new Navigation({
            dataLocation: "children.0.props.children.props",
            data,
            schema: childrenSchema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(3);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            schema: childrenSchema,
            title: childrenSchema.title,
            data,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "children[0].props",
            schemaLocation: "",
            schema: childrenSchema,
            title: childrenSchema.title,
            data: data.children[0].props,
            default: void 0,
        });
        expect(navItems[2]).toEqual({
            dataLocation: "children[0].props.children.props",
            schemaLocation: "",
            schema: textFieldSchema,
            title: textFieldSchema.title,
            data: data.children[0].props.children.props,
            default: void 0,
        });
    });
    test("should return navigation items for an array of children nested in children", () => {
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {
                    restrictedWithChildren: [
                        {
                            id: textFieldSchema.id,
                            props: {},
                        },
                    ],
                },
            },
        };
        const nav: Navigation = new Navigation({
            dataLocation: "children.props.restrictedWithChildren.0.props",
            data,
            schema: generalSchema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(3);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            schema: generalSchema,
            title: generalSchema.title,
            data,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "children.props",
            schemaLocation: "",
            schema: childrenSchema,
            title: childrenSchema.title,
            data: data.children.props,
            default: void 0,
        });
        expect(navItems[2]).toEqual({
            dataLocation: "children.props.restrictedWithChildren[0].props",
            schemaLocation: "",
            schema: textFieldSchema,
            title: textFieldSchema.title,
            data: data.children.props.restrictedWithChildren[0].props,
            default: void 0,
        });
    });
    test("should return navigation items for multiple data root items that can contain children", () => {
        const data: any = {
            restrictedChildrenWithReactDefaults: [
                {
                    id: childrenSchema.id,
                    props: {
                        children: {
                            id: textFieldSchema.id,
                            props: {},
                        },
                    },
                },
            ],
        };
        const nav: Navigation = new Navigation({
            dataLocation: "restrictedChildrenWithReactDefaults[0].props.children.props",
            data,
            schema: childrenSchema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(3);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            schema: childrenSchema,
            title: childrenSchema.title,
            data,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "restrictedChildrenWithReactDefaults[0].props",
            schemaLocation: "",
            schema: childrenSchema,
            title: childrenSchema.title,
            data: data.restrictedChildrenWithReactDefaults[0].props,
            default: void 0,
        });
        expect(navItems[2]).toEqual({
            dataLocation: "restrictedChildrenWithReactDefaults[0].props.children.props",
            schemaLocation: "",
            schema: textFieldSchema,
            title: textFieldSchema.title,
            data: data.restrictedChildrenWithReactDefaults[0].props.children.props,
            default: void 0,
        });
    });
    test("should return navigation items for text children", () => {
        const data: any = {
            children: "example text",
        };
        const nav: Navigation = new Navigation({
            dataLocation: "children",
            data,
            schema: childrenSchema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            schema: childrenSchema,
            data,
            title: childrenSchema.title,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "children",
            schemaLocation: "",
            schema: reactChildrenStringSchema,
            data: data.children,
            title: reactChildrenStringSchema.title,
            default: void 0,
        });
    });
    test("should return navigation items for nested children with properties", () => {
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {
                    objectContainingNestedChildren: {
                        nestedObjectChildren: {
                            id: childrenSchema.id,
                            props: {},
                        },
                    },
                },
            },
        };
        const nav: Navigation = new Navigation({
            dataLocation:
                "children.props.objectContainingNestedChildren.nestedObjectChildren.props",
            data,
            schema: childrenSchema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(4);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            schema: childrenSchema,
            data,
            title: childrenSchema.title,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "children.props",
            schemaLocation: "",
            schema: childrenSchema,
            data: data.children.props,
            title: childrenSchema.title,
            default: void 0,
        });
        expect(navItems[2]).toEqual({
            dataLocation: "children.props.objectContainingNestedChildren",
            schemaLocation: "properties.objectContainingNestedChildren",
            schema: childrenSchema,
            data: data.children.props.objectContainingNestedChildren,
            title: childrenSchema.properties.objectContainingNestedChildren.title,
            default: void 0,
        });
        expect(navItems[3]).toEqual({
            dataLocation:
                "children.props.objectContainingNestedChildren.nestedObjectChildren.props",
            schemaLocation: "",
            schema: childrenSchema,
            data:
                data.children.props.objectContainingNestedChildren.nestedObjectChildren
                    .props,
            title: childrenSchema.title,
            default: void 0,
        });
    });
    test("should return navigation items for nested children with anyOf/oneOf", () => {
        const data: any = {
            children: {
                id: oneOfSchema.id,
                props: {
                    string: "Foo",
                },
            },
        };
        const nav: Navigation = new Navigation({
            dataLocation: "children.props",
            data,
            schema: childrenSchema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            schema: childrenSchema,
            data,
            title: childrenSchema.title,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "children.props",
            schemaLocation: "",
            schema: oneOfSchema,
            data: data.children.props,
            title: oneOfSchema.title,
            default: void 0,
        });
    });
    test("should return navigation items for oneOf/anyOf nested objects", () => {
        const data: any = {
            numberOrString: {
                object: {
                    number: 47,
                },
            },
        };
        const nav: Navigation = new Navigation({
            dataLocation: "numberOrString.object",
            data,
            schema: oneOfSchema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(3);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            data,
            schema: oneOfSchema,
            title: oneOfSchema.title,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "numberOrString",
            schemaLocation: "oneOf[2].properties.numberOrString",
            data: data.numberOrString,
            schema: oneOfSchema,
            title: oneOfSchema.oneOf[2].properties.numberOrString.title,
            default: void 0,
        });
        expect(navItems[2]).toEqual({
            dataLocation: "numberOrString.object",
            schemaLocation:
                "oneOf[2].properties.numberOrString.oneOf[2].properties.object",
            data: data.numberOrString.object,
            schema: oneOfSchema,
            title:
                oneOfSchema.oneOf[2].properties.numberOrString.oneOf[2].properties.object
                    .title,
            default: void 0,
        });
    });
    test("should return navigation items for oneOf/anyOf nested arrays", () => {
        const data: any = {
            numberOrString: ["foo", "bar"],
        };
        const nav: Navigation = new Navigation({
            dataLocation: "numberOrString[0]",
            data,
            schema: oneOfSchema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            data,
            schema: oneOfSchema,
            title: oneOfSchema.title,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "numberOrString[0]",
            schemaLocation: "oneOf[2].properties.numberOrString.oneOf[3].items",
            data: data.numberOrString[0],
            schema: oneOfSchema,
            title: oneOfSchema.oneOf[2].properties.numberOrString.oneOf[3].items.title,
            default: void 0,
        });
    });
    test("should return navigation items for oneOf/anyOf nested objects inside children", () => {
        const data: any = {
            children: {
                id: oneOfSchema.id,
                props: {
                    numberOrString: {
                        object: {
                            number: 47,
                        },
                    },
                },
            },
        };
        const nav: Navigation = new Navigation({
            dataLocation: "children.props.numberOrString.object",
            data,
            schema: childrenSchema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(4);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            data,
            schema: childrenSchema,
            title: childrenSchema.title,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "children.props",
            schemaLocation: "",
            data: data.children.props,
            schema: oneOfSchema,
            title: oneOfSchema.title,
            default: void 0,
        });
        expect(navItems[2]).toEqual({
            dataLocation: "children.props.numberOrString",
            schemaLocation: "oneOf[2].properties.numberOrString",
            data: data.children.props.numberOrString,
            schema: oneOfSchema,
            title: oneOfSchema.oneOf[2].properties.numberOrString.title,
            default: void 0,
        });
        expect(navItems[3]).toEqual({
            dataLocation: "children.props.numberOrString.object",
            schemaLocation:
                "oneOf[2].properties.numberOrString.oneOf[2].properties.object",
            data: data.children.props.numberOrString.object,
            schema: oneOfSchema,
            title:
                oneOfSchema.oneOf[2].properties.numberOrString.oneOf[2].properties.object
                    .title,
            default: void 0,
        });
    });
    test("should return navigation items for deeply nested oneOfs", () => {
        const data: any = {
            propertyKey: {
                propertyKey1: {
                    propertyKey2: {},
                },
            },
        };
        const nav: Navigation = new Navigation({
            dataLocation: "propertyKey.propertyKey1.propertyKey2",
            data,
            schema: deeplyNestedOneOfSchema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(4);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            data,
            schema: deeplyNestedOneOfSchema,
            title: deeplyNestedOneOfSchema.title,
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "propertyKey",
            schemaLocation: "properties.propertyKey",
            data: data.propertyKey,
            schema: deeplyNestedOneOfSchema,
            title: deeplyNestedOneOfSchema.properties.propertyKey.title,
            default: void 0,
        });
        expect(navItems[2]).toEqual({
            dataLocation: "propertyKey.propertyKey1",
            schemaLocation: "properties.propertyKey.oneOf[0].properties.propertyKey1",
            data: data.propertyKey.propertyKey1,
            schema: deeplyNestedOneOfSchema,
            title:
                deeplyNestedOneOfSchema.properties.propertyKey.oneOf[0].properties
                    .propertyKey1.title,
            default: void 0,
        });
        expect(navItems[3]).toEqual({
            dataLocation: "propertyKey.propertyKey1.propertyKey2",
            schemaLocation:
                "properties.propertyKey.oneOf[0].properties.propertyKey1.properties.propertyKey2",
            data: data.propertyKey.propertyKey1.propertyKey2,
            schema: deeplyNestedOneOfSchema,
            title:
                deeplyNestedOneOfSchema.properties.propertyKey.oneOf[0].properties
                    .propertyKey1.properties.propertyKey2.title,
            default: void 0,
        });
    });
    test("should return navigation items for directly nested oneOfs", () => {
        const data: any = {
            propertyKey: 42,
        };
        const schema: any = {
            type: "object",
            oneOf: [
                {
                    oneOf: [
                        {
                            properties: {
                                propertyKey: {
                                    type: "string",
                                },
                            },
                            required: ["propertyKey"],
                        },
                        {
                            properties: {
                                propertyKey: {
                                    type: "number",
                                },
                            },
                            required: ["propertyKey"],
                        },
                    ],
                },
            ],
        };
        const nav: Navigation = new Navigation({
            dataLocation: "propertyKey",
            data,
            schema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            data,
            schema,
            title: "Untitled",
            default: void 0,
        });
        expect(navItems[1]).toEqual({
            dataLocation: "propertyKey",
            schemaLocation: "oneOf[0].oneOf[1].properties.propertyKey",
            data: data.propertyKey,
            schema,
            title: "Untitled",
            default: void 0,
        });
    });
    test("should return navigation items with default values", () => {
        const defaultValue: string = "bar";
        const schema: any = {
            properties: {
                foo: {
                    type: "string",
                    default: defaultValue,
                },
            },
        };
        const nav: Navigation = new Navigation({
            dataLocation: "foo",
            data: {},
            schema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[1]).toEqual({
            dataLocation: "foo",
            schemaLocation: "properties.foo",
            data: void 0,
            schema,
            title: "Untitled",
            default: defaultValue,
        });
    });
    test("should return navigation items of objects with inherited default values", () => {
        const defaultValue1: string = "a";
        const schema: any = {
            properties: {
                foo: {
                    type: "string",
                },
            },
            default: {
                foo: defaultValue1,
            },
        };
        const nav: Navigation = new Navigation({
            dataLocation: "foo",
            data: {},
            schema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[1]).toEqual({
            dataLocation: "foo",
            schemaLocation: "properties.foo",
            data: void 0,
            schema,
            title: "Untitled",
            default: defaultValue1,
        });
    });
    test("should return navigation items of arrays with inherited default values", () => {
        const defaultValue1: string = "a";
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
            default: {
                foo: [defaultValue1],
            },
        };
        const nav: Navigation = new Navigation({
            dataLocation: "foo[0]",
            data: {},
            schema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[1]).toEqual({
            dataLocation: "foo[0]",
            schemaLocation: "properties.foo.items",
            data: void 0,
            schema,
            title: "Untitled",
            default: defaultValue1,
        });
    });
    test("should return navigation items of arrays with scoped default values", () => {
        const defaultValue1: string = "a";
        const defaultValue2: string = "b";
        const schema: any = {
            properties: {
                foo: {
                    type: "array",
                    items: {
                        type: "string",
                        default: defaultValue2,
                    },
                },
            },
            default: {
                foo: [defaultValue1],
            },
        };
        const nav: Navigation = new Navigation({
            dataLocation: "foo.0",
            data: {},
            schema,
            childOptions,
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[1]).toEqual({
            dataLocation: "foo[0]",
            schemaLocation: "properties.foo.items",
            data: void 0,
            schema,
            title: "Untitled",
            default: defaultValue2,
        });
    });
    test("should update the navigation if the data location has been update", () => {
        const callback: any = jest.fn();
        const data: any = {
            foo: {
                bar: "bat",
            },
        };
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "object",
                    properties: {
                        bar: {
                            type: "string",
                        },
                    },
                },
            },
        };
        const nav: Navigation = new Navigation({
            data,
            schema,
            dataLocation: "foo",
            childOptions: [],
        });
        const navItems: NavigationItem[] = nav.get();

        expect(navItems.length).toBe(2);
        expect(navItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            data,
            schema,
            title: "Untitled",
            default: void 0,
        });

        nav.updateDataLocation("", callback);
        expect(callback).toHaveBeenCalled();

        const updatedNavItems: NavigationItem[] = callback.mock.calls[0][0];

        expect(updatedNavItems.length).toEqual(1);
        expect(updatedNavItems[0]).toEqual({
            dataLocation: "",
            schemaLocation: "",
            data,
            schema,
            title: "Untitled",
            default: void 0,
        });
    });
    test("should update the navigation if the data has been updated", () => {
        const callback: any = jest.fn();
        const data: any = {
            foo: {
                bar: "bat",
            },
        };
        const dataUpdated: any = {
            foo: {
                bar: "foo",
            },
        };
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "object",
                    properties: {
                        bar: {
                            type: "string",
                        },
                    },
                },
            },
        };
        const nav: Navigation = new Navigation({
            data,
            schema,
            dataLocation: "foo",
            childOptions: [],
        });

        nav.updateData(dataUpdated, callback);
        const navItems: NavigationItem[] = callback.mock.calls[0][0];

        expect(navItems[1]).toEqual({
            dataLocation: "foo",
            schemaLocation: "properties.foo",
            data: dataUpdated.foo,
            schema,
            title: "Untitled",
            default: void 0,
        });
    });
});
