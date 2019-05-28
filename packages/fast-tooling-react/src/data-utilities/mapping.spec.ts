import "jest";
import { get } from "lodash-es";
import { ChildOptionItem, mapDataToComponent } from "./";
import { CodePreviewChildOption, mapDataToCodePreview } from "./mapping";

import ChildrenWithRenderProp from "./__tests__/components/children-plugin";
import Children from "./__tests__/components/children";
import TextField from "./__tests__/components/text-field";
import badgeSchema from "../__tests__/schemas/badge.schema.json";
import childrenSchema from "../__tests__/schemas/children.schema.json";
import childrenWithPluginPropsSchema from "../__tests__/schemas/children-plugin.schema.json";
import textFieldSchema from "../__tests__/schemas/text-field.schema.json";
import MapChildrenPropToCallbackPassingClassName from "./__tests__/plugins/map-children-prop-to-callback-passing-class-name";
import MapBooleanPropToString from "./__tests__/plugins/map-boolean-prop-to-string";
import MapArrayPropToObject from "./__tests__/plugins/map-array-prop-to-object";

describe("mapDataToComponent", () => {
    const childrenPluginResolverId: string =
        childrenWithPluginPropsSchema.reactProperties.render.pluginId;
    const arrayPluginResolverId: string =
        childrenWithPluginPropsSchema.properties.array.pluginId;
    const booleanPluginResolverId: string =
        childrenWithPluginPropsSchema.properties.boolean.pluginId;
    const childOptions: ChildOptionItem[] = [
        { component: Children, schema: childrenSchema },
        { component: TextField, schema: textFieldSchema },
        { component: ChildrenWithRenderProp, schema: childrenWithPluginPropsSchema },
    ];

    test("should map data to a child", () => {
        const textString: string = "Hello world";
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {},
            },
        };
        const dataWithChildString: any = {
            children: textString,
        };

        const mappedData: any = mapDataToComponent(childrenSchema, data, childOptions);
        const mappedDataWithChildString: any = mapDataToComponent(
            childrenSchema,
            dataWithChildString,
            childOptions
        );

        expect(typeof get(mappedData, "children.type")).toBe("function");
        expect(get(mappedData, "children.type.displayName")).toBe("Children");
        expect(typeof get(mappedDataWithChildString, "children")).toBe("string");
        expect(get(mappedDataWithChildString, "children")).toBe(textString);
    });
    test("should map data to multiple children", () => {
        const data: any = {
            children: [
                {
                    id: childrenSchema.id,
                    props: {},
                },
                "Hello pluto",
            ],
        };

        const mappedData: any = mapDataToComponent(childrenSchema, data, childOptions);

        expect(typeof get(mappedData, "children[0].type")).toBe("function");
        expect(get(mappedData, "children[0].type.displayName")).toBe("Children");
        expect(typeof get(mappedData, "children[1]")).toBe("string");
        expect(get(mappedData, "children[1]")).toBe("Hello pluto");
    });
    test("should map data to nested children", () => {
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
                {
                    id: textFieldSchema.id,
                    props: {},
                },
            ],
        };

        const mappedData: any = mapDataToComponent(childrenSchema, data, childOptions);

        expect(typeof get(mappedData, "children[0].type")).toBe("function");
        expect(get(mappedData, "children[0].type.displayName")).toBe("Children");
        expect(typeof get(mappedData, "children[0].props.children.type")).toBe(
            "function"
        );
        expect(get(mappedData, "children[0].props.children.type.displayName")).toBe(
            "Text field"
        );
        expect(typeof get(mappedData, "children[1].type")).toBe("function");
        expect(get(mappedData, "children[1].type.displayName")).toBe("Text field");
    });
    test("should map simple data to a plugin", () => {
        const data: any = {
            boolean: true,
            array: ["foo", "bar", "bat"],
        };
        const mappedData: any = mapDataToComponent(
            childrenWithPluginPropsSchema,
            data,
            childOptions,
            [
                new MapBooleanPropToString({
                    id: [booleanPluginResolverId],
                }),
                new MapArrayPropToObject({
                    id: arrayPluginResolverId,
                }),
            ]
        );

        expect(typeof mappedData.boolean).toBe("string");
        expect(typeof mappedData.array).toBe("object");
        expect(mappedData.array.foo).toEqual(0);
        expect(mappedData.array.bar).toEqual(1);
        expect(mappedData.array.bat).toEqual(2);
    });
    test("should map children to a plugin", () => {
        const data: any = {
            render: {
                id: textFieldSchema.id,
                props: {},
            },
        };
        const testClass: string = "Hello world";
        const mappedData: any = mapDataToComponent(
            childrenWithPluginPropsSchema,
            data,
            childOptions,
            [
                new MapChildrenPropToCallbackPassingClassName({
                    id: childrenPluginResolverId,
                }),
            ]
        );

        expect(mappedData.render).toHaveLength(1);
        expect(typeof mappedData.render).toBe("function");
        expect(mappedData.render(testClass).type.displayName).toEqual("Text field");
        expect(mappedData.render(testClass).props.className).toBe(testClass);
    });
    test("should map arrays of children to plugins", () => {
        const data: any = {
            render: [
                {
                    id: textFieldSchema.id,
                    props: {},
                },
                {
                    id: childrenSchema.id,
                    props: {},
                },
            ],
        };
        const testClass1: string = "Foo";
        const testClass2: string = "Bar";
        const mappedData: any = mapDataToComponent(
            childrenWithPluginPropsSchema,
            data,
            childOptions,
            [
                new MapChildrenPropToCallbackPassingClassName({
                    id: childrenPluginResolverId,
                }),
            ]
        );

        expect(mappedData.render).toHaveLength(2);
        expect(typeof mappedData.render[0]).toBe("function");
        expect(mappedData.render[0](testClass1).type.displayName).toEqual("Text field");
        expect(mappedData.render[0](testClass1).props.className).toBe(testClass1);
        expect(typeof mappedData.render[1]).toBe("function");
        expect(mappedData.render[1](testClass2).type.displayName).toEqual("Children");
        expect(mappedData.render[1](testClass2).props.className).toBe(testClass2);
    });
    test("should map children to a plugin nested inside a child", () => {
        const data: any = {
            children: {
                id: childrenWithPluginPropsSchema.id,
                props: {
                    render: {
                        id: textFieldSchema.id,
                        props: {},
                    },
                },
            },
        };

        const testClass: string = "Foo";
        const mappedData: any = mapDataToComponent(childrenSchema, data, childOptions, [
            new MapChildrenPropToCallbackPassingClassName({
                id: childrenPluginResolverId,
            }),
        ]);

        expect(typeof get(mappedData, "children.type")).toBe("function");
        expect(get(mappedData, "children.type.displayName")).toBe(
            "ChildrenWithRenderProp"
        );
        expect(get(mappedData, "children.props.render")(testClass).props.className).toBe(
            testClass
        );
    });
    test("should map a child nested inside a children plugin", () => {
        const data: any = {
            render: {
                id: childrenSchema.id,
                props: {
                    children: {
                        id: textFieldSchema.id,
                        props: {},
                    },
                },
            },
        };

        const testClass: string = "Foo";
        const mappedData: any = mapDataToComponent(
            childrenWithPluginPropsSchema,
            data,
            childOptions,
            [
                new MapChildrenPropToCallbackPassingClassName({
                    id: childrenPluginResolverId,
                }),
            ]
        );

        const executedRenderProp: any = get(mappedData, "render")(testClass);

        expect(executedRenderProp.props.className).toBe(testClass);

        expect(typeof get(executedRenderProp, "props.children.type")).toBe("function");
        expect(get(executedRenderProp, "props.children.type.displayName")).toBe(
            "Text field"
        );
    });
    test("should not map data to a plugin if a plugin is not available but a pluginId has been specified", () => {
        const data: any = {
            render: [
                {
                    id: textFieldSchema.id,
                    props: {},
                },
            ],
            boolean: true,
            array: ["foo", "bar", "bat"],
        };
        const mappedData: any = mapDataToComponent(
            childrenWithPluginPropsSchema,
            data,
            childOptions,
            [
                new MapBooleanPropToString({
                    id: booleanPluginResolverId,
                }),
            ]
        );

        expect(typeof mappedData.boolean).toBe("string");
        expect(Array.isArray(mappedData.array)).toBe(true);
        expect(mappedData.render[0].props).toEqual({});
    });
});

describe("mapDataToCodePreview", () => {
    const codePreviewChildOptions: CodePreviewChildOption[] = [
        {
            name: "TextField",
            schema: textFieldSchema,
        },
        {
            name: "Children",
            schema: childrenSchema,
        },
        {
            name: "Badge",
            schema: badgeSchema,
        },
    ];

    const simpleData: any = {
        componentName: "SimpleComponent",
        data: {
            children: "foo",
        },
    };

    const withPropertiesData: any = {
        componentName: "WithPropertiesComponent",
        data: {
            property: "Property Value",
        },
    };

    const withChildrenData: any = {
        componentName: "WithChildrenComponent",
        childOptions: codePreviewChildOptions,
        data: {
            children: [
                {
                    id: childrenSchema.id,
                },
            ],
        },
    };

    const withChildObjectData: any = {
        componentName: "WithChildObjectComponent",
        childOptions: codePreviewChildOptions,
        data: {
            badge: {
                id: badgeSchema.id,
            },
        },
    };

    const childrenwithObjectsData: any = {
        componentName: "ChildrenwithObjectsComponent",
        childOptions: codePreviewChildOptions,
        data: {
            children: [
                {
                    id: childrenSchema.id,
                    props: {
                        objectContainingNestedChildren: {},
                        arrayContainingNestedChildren: [
                            {
                                id: textFieldSchema.id,
                                props: {
                                    tag: "span",
                                    text: "FooBar",
                                },
                            },
                            {
                                id: textFieldSchema.id,
                                props: {
                                    tag: "span",
                                    text: "FooBar",
                                },
                            },
                        ],
                    },
                },
            ],
        },
    };

    const childrenWithReactPropertiesData: any = {
        componentName: "childrenWithReactPropertiesComponent",
        childOptions: codePreviewChildOptions,
        data: {
            children: [
                {
                    id: badgeSchema.id,
                    props: {
                        childrenWithDefault: {
                            id: textFieldSchema.id,
                            props: {
                                tag: "span",
                                text: "FooBar",
                            },
                        },
                    },
                },
            ],
        },
    };

    const objectsWithChildrenData: any = {
        componentName: "objectsWithChildrenComponent",
        childOptions: codePreviewChildOptions,
        data: {
            children: [
                {
                    id: childrenSchema.id,
                    props: {
                        arrayContainingNestedChildren: [
                            {
                                id: textFieldSchema.id,
                                props: {
                                    tag: "span",
                                    text: "FooBar",
                                    children: ["test"],
                                },
                            },
                        ],
                    },
                },
            ],
        },
    };

    test("should return a string", () => {
        const mappedData: any = mapDataToCodePreview(simpleData);

        expect(typeof mappedData).toBe("string");
    });

    test("should return a string containing a a component name as a JSX tag", () => {
        const mappedData: any = mapDataToCodePreview(simpleData);

        expect(mappedData).toContain("<SimpleComponent>");
        expect(mappedData).toContain("</SimpleComponent>");
    });

    test("should add a property on a JSX tag if a property has been passed", () => {
        const mappedData: any = mapDataToCodePreview(withPropertiesData);

        expect(mappedData).toContain('property="Property Value"');
    });

    test("should return a string containing children", () => {
        const mappedData: any = mapDataToCodePreview(withChildrenData);

        expect(mappedData).toContain("<Children />");
    });

    test("should create a const and assign to property if property is an object", () => {
        const mappedData: any = mapDataToCodePreview(withChildObjectData);

        expect(mappedData).toContain("const badge");
        expect(mappedData).toContain("badge={badge}");
    });

    test("should create a const and assign to property if property on child is an object", () => {
        const mappedData: any = mapDataToCodePreview(childrenwithObjectsData);

        expect(mappedData).toContain(
            "const childrenwithObjectsComponent0ObjectContainingNestedChildren"
        );
        expect(mappedData).toContain(
            "objectContainingNestedChildren={childrenwithObjectsComponent0ObjectContainingNestedChildren}"
        );
    });

    test("should add a property on child JSX tag if a child property has been passed", () => {
        const mappedData: any = mapDataToCodePreview(childrenWithReactPropertiesData);

        expect(mappedData).toContain("childrenWithDefault={");
    });

    test("should add children when children are passed to child object", () => {
        const mappedData: any = mapDataToCodePreview(objectsWithChildrenData);

        expect(mappedData).toContain('"children": [');
        expect(mappedData).toContain('"test');
    });
});
